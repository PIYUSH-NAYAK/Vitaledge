const { connection, wallet, web3 } = require('./solanaConnection');
const borsh = require('borsh');

// Smart contract program ID (deployed contract)
const PROGRAM_ID = new web3.PublicKey('DBL4hbkkDsVHwDBSKGmA4ivneVR8Zf5RHmYHpE1XrR8x');

// Instruction schemas for Borsh serialization
class CreateBatchInstruction {
    constructor(batch_id, manufacturer) {
        this.batch_id = batch_id;
        this.manufacturer = manufacturer;
    }
}

class TransferOwnershipInstruction {
    constructor(batch_id, new_owner, signature) {
        this.batch_id = batch_id;
        this.new_owner = new_owner;
        this.signature = signature;
    }
}

class VerifyBatchInstruction {
    constructor(batch_id) {
        this.batch_id = batch_id;
    }
}

// Borsh schema
const SCHEMA = new Map([
    [CreateBatchInstruction, {
        kind: 'struct',
        fields: [
            ['instruction', 'u8'],
            ['batch_id', 'string'],
            ['manufacturer', 'string'],
        ],
    }],
    [TransferOwnershipInstruction, {
        kind: 'struct',
        fields: [
            ['instruction', 'u8'],
            ['batch_id', 'string'],
            ['new_owner', 'string'],
            ['signature', [64]],
        ],
    }],
    [VerifyBatchInstruction, {
        kind: 'struct',
        fields: [
            ['instruction', 'u8'],
            ['batch_id', 'string'],
        ],
    }],
]);

// Helper function to create instruction data
function createInstructionData(instructionType, data) {
    switch (instructionType) {
        case 0: // CreateBatch
            return borsh.serialize(SCHEMA, new CreateBatchInstruction(data.batch_id, data.manufacturer));
        case 1: // TransferOwnership
            return borsh.serialize(SCHEMA, new TransferOwnershipInstruction(data.batch_id, data.new_owner, data.signature));
        case 2: // VerifyBatch
            return borsh.serialize(SCHEMA, new VerifyBatchInstruction(data.batch_id));
        default:
            throw new Error('Unknown instruction type');
    }
}

// Create a new medicine batch on blockchain
const createMedicineBatch = async (batchId, manufacturerAddress = null) => {
    try {
        const manufacturer = manufacturerAddress || wallet.publicKey.toString();
        
        // Generate batch account keypair
        const batchAccount = web3.Keypair.generate();
        
        // Create instruction data
        const instructionData = createInstructionData(0, {
            batch_id: batchId,
            manufacturer: manufacturer
        });
        
        // Create transaction
        const transaction = new web3.Transaction().add(
            new web3.TransactionInstruction({
                keys: [
                    { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
                    { pubkey: batchAccount.publicKey, isSigner: true, isWritable: true },
                    { pubkey: web3.SystemProgram.programId, isSigner: false, isWritable: false },
                    { pubkey: web3.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
                ],
                programId: PROGRAM_ID,
                data: Buffer.from(instructionData),
            })
        );
        
        // Send transaction
        const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [wallet, batchAccount],
            {
                commitment: 'confirmed',
                preflightCommitment: 'confirmed',
            }
        );

        return {
            success: true,
            signature,
            batchAccount: batchAccount.publicKey.toString(),
            transactionHash: signature,
            batchId: batchId
        };

    } catch (error) {
        console.error('Error creating batch on blockchain:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Transfer ownership of a medicine batch
const transferBatchOwnership = async (batchAccountAddress, batchId, newOwnerAddress) => {
    try {
        // Create signature (placeholder - implement proper Ed25519 signing)
        const signature = new Uint8Array(64).fill(0);
        
        const instructionData = createInstructionData(1, {
            batch_id: batchId,
            new_owner: newOwnerAddress,
            signature: Array.from(signature)
        });
        
        const transaction = new web3.Transaction().add(
            new web3.TransactionInstruction({
                keys: [
                    { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
                    { pubkey: new web3.PublicKey(batchAccountAddress), isSigner: false, isWritable: true },
                ],
                programId: PROGRAM_ID,
                data: Buffer.from(instructionData),
            })
        );
        
        const txSignature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [wallet],
            {
                commitment: 'confirmed',
                preflightCommitment: 'confirmed',
            }
        );

        return {
            success: true,
            signature: txSignature,
            transactionHash: txSignature,
            newOwner: newOwnerAddress
        };

    } catch (error) {
        console.error('Error transferring ownership on blockchain:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Verify a medicine batch on blockchain
const verifyMedicineBatch = async (batchId) => {
    try {
        const instructionData = createInstructionData(2, {
            batch_id: batchId
        });
        
        const transaction = new web3.Transaction().add(
            new web3.TransactionInstruction({
                keys: [
                    { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
                ],
                programId: PROGRAM_ID,
                data: Buffer.from(instructionData),
            })
        );
        
        const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [wallet],
            {
                commitment: 'confirmed',
                preflightCommitment: 'confirmed',
            }
        );

        return {
            success: true,
            signature,
            transactionHash: signature,
            verified: true,
            batchId: batchId
        };

    } catch (error) {
        console.error('Error verifying batch on blockchain:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Get batch information from blockchain
const getBatchInfo = async (batchAccountAddress) => {
    try {
        const accountInfo = await connection.getAccountInfo(new web3.PublicKey(batchAccountAddress));
        
        if (!accountInfo) {
            return {
                success: false,
                error: 'Batch account not found'
            };
        }

        return {
            success: true,
            data: {
                owner: accountInfo.owner.toString(),
                lamports: accountInfo.lamports,
                dataLength: accountInfo.data.length,
                executable: accountInfo.executable,
                // Note: To get actual batch data, you'd need to deserialize the account data
                // using the BatchAccount struct from the smart contract
            }
        };

    } catch (error) {
        console.error('Error getting batch info from blockchain:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Get connection status
const getConnectionStatus = async () => {
    try {
        const version = await connection.getVersion();
        const balance = await connection.getBalance(wallet.publicKey);
        
        return {
            connected: true,
            version: version['solana-core'],
            network: connection.rpcEndpoint,
            walletBalance: balance / web3.LAMPORTS_PER_SOL,
            programId: PROGRAM_ID.toString()
        };
    } catch (error) {
        return {
            connected: false,
            error: error.message
        };
    }
};

// Get transaction history for a batch
const getBatchTransactionHistory = async (batchAccountAddress) => {
    try {
        const signatures = await connection.getSignaturesForAddress(
            new web3.PublicKey(batchAccountAddress),
            { limit: 50 }
        );
        
        const transactions = [];
        
        for (const signatureInfo of signatures) {
            const transaction = await connection.getTransaction(signatureInfo.signature);
            if (transaction) {
                transactions.push({
                    signature: signatureInfo.signature,
                    slot: signatureInfo.slot,
                    blockTime: signatureInfo.blockTime,
                    status: transaction.meta?.err ? 'Failed' : 'Success',
                    fee: transaction.meta?.fee
                });
            }
        }
        
        return {
            success: true,
            transactions
        };
        
    } catch (error) {
        console.error('Error getting transaction history:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    createMedicineBatch,
    transferBatchOwnership,
    verifyMedicineBatch,
    getBatchInfo,
    getConnectionStatus,
    getBatchTransactionHistory,
    PROGRAM_ID
};
