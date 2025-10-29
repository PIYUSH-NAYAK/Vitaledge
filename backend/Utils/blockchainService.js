const { connection, wallet, web3 } = require('./solanaConnection');
const { serialize, deserialize } = require('borsh');

// Read program id and cluster from env so it is configurable
const PROGRAM_ID_STR = process.env.SOLANA_PROGRAM_ID || process.env.PROGRAM_ID || process.env.MEDWEB3_PROGRAM_ID;
if (!PROGRAM_ID_STR) {
    console.warn('⚠️ SOLANA_PROGRAM_ID not set. Set SOLANA_PROGRAM_ID (or PROGRAM_ID / MEDWEB3_PROGRAM_ID) in your .env to your deployed program id. Falling back to hardcoded ID.');
}
const PROGRAM_ID = new web3.PublicKey(PROGRAM_ID_STR || '7e1SU615mkoWoQsx2HxxujKj9tU8QRF1hHD8gUiWuvWQ');

const SOLANA_CLUSTER = process.env.SOLANA_CLUSTER || process.env.SOLANA_NETWORK || 'devnet';

// Borsh schema matching the Rust enum structure
// In Rust: enum MedWeb3Instruction { CreateBatch { batch_id: String } }
// Borsh encodes enums as: [variant_index: u8, ...variant_data]

class CreateBatchData {
    constructor(fields) {
        if (fields) {
            this.batch_id = fields.batch_id;
        }
    }
}

// Schema for the CreateBatch variant data (simple schema used for serialization)
const createBatchSchema = new Map([[CreateBatchData, { kind: 'struct', fields: [['batch_id', 'string']] }]]);

// Helper: decode on-chain BatchAccount encoded by the Rust program using Borsh
// We parse the binary manually because the BatchAccount contains fixed-size pubkeys
const decodeBatchAccount = (buffer) => {
    try {
        let offset = 0;

        // batch_id: String (u32 length LE + bytes)
        const batchIdLen = buffer.readUInt32LE(offset);
        offset += 4;
        const batchId = buffer.slice(offset, offset + batchIdLen).toString();
        offset += batchIdLen;

        // manufacturer: Pubkey (32 bytes)
        const manufacturer = new web3.PublicKey(buffer.slice(offset, offset + 32)).toString();
        offset += 32;

        // current_owner: Pubkey (32 bytes)
        const currentOwner = new web3.PublicKey(buffer.slice(offset, offset + 32)).toString();
        offset += 32;

        // created_at: i64 (8 bytes)
        const createdAt = Number(buffer.readBigInt64LE(offset));
        offset += 8;

        // ownership_history: Vec<OwnershipRecord> (u32 len + entries)
        const historyLen = buffer.readUInt32LE(offset);
        offset += 4;

        const ownershipHistory = [];
        for (let i = 0; i < historyLen; i++) {
            const owner = new web3.PublicKey(buffer.slice(offset, offset + 32)).toString();
            offset += 32;
            const timestamp = Number(buffer.readBigInt64LE(offset));
            offset += 8;
            ownershipHistory.push({ owner, timestamp });
        }

        // is_active: bool (1 byte)
        const isActive = buffer.readUInt8(offset) === 1;

        return {
            batchId,
            manufacturer,
            currentOwner,
            createdAt,
            ownershipHistory,
            isActive
        };
    } catch (err) {
        console.error('Error decoding batch account:', err);
        return null;
    }
};

// Create a new medicine batch on blockchain
const createMedicineBatch = async (batchId, manufacturerAddress) => {
    try {
        console.log('🔗 Creating medicine batch on blockchain...');
        console.log('Batch ID:', batchId);
        console.log('Manufacturer:', manufacturerAddress);

        // Create a new account for this batch
        const batchAccount = web3.Keypair.generate();
        
        // Calculate space needed (conservative estimate)
        const batchIdLen = batchId.length;
        // 4 (string length) + batch_id + 32 (manufacturer) + 32 (owner) + 8 (timestamp) + 4 (vec length) + 400 (history) + 1 (bool)
        const accountSize = 4 + batchIdLen + 32 + 32 + 8 + 4 + 400 + 1;
        
        const rentExemptAmount = await connection.getMinimumBalanceForRentExemption(accountSize);

        console.log('Batch account:', batchAccount.publicKey.toString());
        console.log('Account size:', accountSize, 'bytes');
        console.log('Rent:', rentExemptAmount / web3.LAMPORTS_PER_SOL, 'SOL');

    // Serialize the CreateBatch variant data (just the batch_id)
    const variantData = serialize(createBatchSchema, new CreateBatchData({ batch_id: batchId }));

    // Rust enum encoding: variant_index (u8) + variant_data
    // CreateBatch is the first variant (index 0)
    const variantIndex = Buffer.from([0]); // 0 = CreateBatch
    const instructionBuffer = Buffer.concat([variantIndex, Buffer.from(variantData)]);

        console.log('Variant index: 0 (CreateBatch)');
        console.log('Variant data length:', variantData.length, 'bytes');
        console.log('Total instruction length:', instructionBuffer.length, 'bytes');

        // Create transaction
        const transaction = new web3.Transaction();

        // Add instruction to initialize the batch (our program creates the account internally)
        transaction.add(
            new web3.TransactionInstruction({
                keys: [
                    { pubkey: wallet.publicKey, isSigner: true, isWritable: true }, // Payer
                    { pubkey: batchAccount.publicKey, isSigner: true, isWritable: true }, // Batch account
                    { pubkey: web3.SystemProgram.programId, isSigner: false, isWritable: false }, // System program
                    { pubkey: web3.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }, // Rent sysvar
                    { pubkey: web3.SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false }, // Clock sysvar
                ],
                programId: PROGRAM_ID,
                data: instructionBuffer,
            })
        );

        console.log('Sending transaction...');

        // Sign and send transaction
        const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [wallet, batchAccount],
            {
                commitment: 'confirmed',
                preflightCommitment: 'confirmed',
            }
        );

        console.log('✅ Transaction confirmed!');
        console.log('Signature:', signature);
        console.log('Batch Account:', batchAccount.publicKey.toString());

        return {
            success: true,
            signature,
            batchAccount: batchAccount.publicKey.toString(),
            transactionHash: signature
        };

    } catch (error) {
        console.error('❌ Error creating batch on blockchain:', error);
        console.error('Error details:', error.logs || error.message);
        return {
            success: false,
            error: error.message,
            logs: error.logs
        };
    }
};

// Transfer ownership of a medicine batch
const transferBatchOwnership = async (batchId, newOwnerAddress, currentOwnerWallet) => {
    try {
        // Proper Borsh-like encoding for enum variant: [variant_index: u8] + variant_data
        // TransferOwnership is variant index 1 in the Rust enum. The variant data is a Pubkey (32 bytes).
        const variantIndex = Buffer.from([1]); // 1 = TransferOwnership
        const newOwnerPubkeyBuf = new web3.PublicKey(newOwnerAddress).toBuffer();
        const instructionBuffer = Buffer.concat([variantIndex, Buffer.from(newOwnerPubkeyBuf)]);

        // Create transaction
        const transaction = new web3.Transaction();

        // Add transfer instruction
        transaction.add(
            new web3.TransactionInstruction({
                keys: [
                    { pubkey: currentOwnerWallet.publicKey, isSigner: true, isWritable: false },
                    { pubkey: new web3.PublicKey(batchId), isSigner: false, isWritable: true }, // Batch account
                    { pubkey: web3.SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
                ],
                programId: PROGRAM_ID,
                data: instructionBuffer,
            })
        );

        // Sign and send transaction
        const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [currentOwnerWallet],
            {
                commitment: 'confirmed',
                preflightCommitment: 'confirmed',
            }
        );

        return {
            success: true,
            signature,
            transactionHash: signature
        };

    } catch (error) {
        console.error('Error transferring batch ownership:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Verify a medicine batch
const verifyBatch = async (batchId) => {
    try {
        const batchAccount = new web3.PublicKey(batchId);
        const accountInfo = await connection.getAccountInfo(batchAccount);

        if (!accountInfo) {
            return { success: false, error: 'Batch not found on blockchain' };
        }

        // Ensure the account belongs to our program
        const isValidOwner = accountInfo.owner.equals(PROGRAM_ID);
        if (!isValidOwner) {
            return { success: false, error: 'Account not owned by program' };
        }

        // Decode the account data into meaningful fields
        const decoded = decodeBatchAccount(Buffer.from(accountInfo.data));
        if (!decoded) {
            return { success: false, error: 'Failed to decode batch account data' };
        }

        return {
            success: true,
            batchId,
            contractAddress: batchId,
            owner: accountInfo.owner.toString(),
            dataLength: accountInfo.data.length,
            decoded
        };

    } catch (error) {
        console.error('Error verifying batch:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Process payment transaction
const processPayment = async (amount, recipientAddress, senderWallet) => {
    try {
        // Convert amount to lamports (SOL's smallest unit)
        const lamports = amount * web3.LAMPORTS_PER_SOL;

        // Create transfer instruction
        const transferInstruction = web3.SystemProgram.transfer({
            fromPubkey: senderWallet.publicKey,
            toPubkey: new web3.PublicKey(recipientAddress),
            lamports: lamports,
        });

        // Create transaction
        const transaction = new web3.Transaction().add(transferInstruction);

        // Get latest blockhash
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = senderWallet.publicKey;

        // Sign and send transaction
        const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [senderWallet],
            {
                commitment: 'confirmed',
                preflightCommitment: 'confirmed',
            }
        );

        return {
            success: true,
            signature,
            transactionHash: signature,
            amount: amount,
            from: senderWallet.publicKey.toString(),
            to: recipientAddress
        };

    } catch (error) {
        console.error('Error processing payment:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Get transaction details
const getTransactionDetails = async (signature) => {
    try {
        const transaction = await connection.getTransaction(signature, {
            commitment: 'confirmed'
        });

        if (!transaction) {
            return {
                success: false,
                error: 'Transaction not found'
            };
        }

        return {
            success: true,
            transaction: {
                signature,
                blockTime: transaction.blockTime,
                slot: transaction.slot,
                fee: transaction.meta.fee,
                status: transaction.meta.err ? 'failed' : 'success'
            }
        };

    } catch (error) {
        console.error('Error getting transaction details:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    createMedicineBatch,
    transferBatchOwnership,
    verifyBatch,
    processPayment,
    getTransactionDetails
};
