const { connection, wallet, web3 } = require('./solanaConnection');
const borsh = require('borsh');

// Smart contract program ID (deployed contract)
const PROGRAM_ID = new web3.PublicKey('DBL4hbkkDsVHwDBSKGmA4ivneVR8Zf5RHmYHpE1XrR8x');

// Create a new medicine batch on blockchain
const createMedicineBatch = async (batchId, manufacturerAddress) => {
    try {
        // Create instruction data for batch creation
        const instructionData = {
            CreateBatch: {
                batch_id: batchId,
                manufacturer: manufacturerAddress
            }
        };

        // Serialize instruction data (simplified - in real implementation, use borsh)
        const data = Buffer.from(JSON.stringify(instructionData));

        // Create accounts needed for the transaction
        const batchAccount = web3.Keypair.generate(); // New account for this batch
        
        // Calculate rent for the batch account
        const rentExemptAmount = await connection.getMinimumBalanceForRentExemption(256); // Estimated size

        // Create the transaction
        const transaction = new web3.Transaction();

        // Add instruction to create the batch account
        transaction.add(
            web3.SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: batchAccount.publicKey,
                lamports: rentExemptAmount,
                space: 256, // Estimated space needed
                programId: PROGRAM_ID,
            })
        );

        // Add instruction to initialize the batch
        transaction.add(
            new web3.TransactionInstruction({
                keys: [
                    { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
                    { pubkey: batchAccount.publicKey, isSigner: false, isWritable: true },
                    { pubkey: web3.SystemProgram.programId, isSigner: false, isWritable: false },
                    { pubkey: web3.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
                ],
                programId: PROGRAM_ID,
                data: data,
            })
        );

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

        return {
            success: true,
            signature,
            batchAccount: batchAccount.publicKey.toString(),
            transactionHash: signature
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
const transferBatchOwnership = async (batchId, newOwnerAddress, currentOwnerWallet) => {
    try {
        // Create instruction data for ownership transfer
        const instructionData = {
            TransferOwnership: {
                batch_id: batchId,
                new_owner: newOwnerAddress,
                signature: new Array(64).fill(0) // Placeholder signature
            }
        };

        const data = Buffer.from(JSON.stringify(instructionData));

        // Create transaction
        const transaction = new web3.Transaction();

        // Add transfer instruction
        transaction.add(
            new web3.TransactionInstruction({
                keys: [
                    { pubkey: currentOwnerWallet.publicKey, isSigner: true, isWritable: false },
                    { pubkey: new web3.PublicKey(batchId), isSigner: false, isWritable: true }, // Batch account
                ],
                programId: PROGRAM_ID,
                data: data,
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
        // In a real implementation, this would query the blockchain
        // For now, we'll simulate verification
        
        const batchAccount = new web3.PublicKey(batchId);
        const accountInfo = await connection.getAccountInfo(batchAccount);
        
        if (!accountInfo) {
            return {
                success: false,
                error: 'Batch not found on blockchain'
            };
        }

        // Parse account data (simplified)
        const isValid = accountInfo.owner.equals(PROGRAM_ID);

        return {
            success: true,
            isValid,
            batchId,
            owner: accountInfo.owner.toString(),
            dataLength: accountInfo.data.length
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
