import { Connection, PublicKey, Transaction, TransactionInstruction, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import * as borsh from 'borsh';
import { Buffer } from 'buffer';

// Contract configuration
export const PROGRAM_ID = new PublicKey('7e1SU615mkoWoQsx2HxxujKj9tU8QRF1hHD8gUiWuvWQ');
export const NETWORK_URL = 'https://api.devnet.solana.com';

// Instruction schemas
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

// Smart contract service class
export class MedWeb3Service {
    constructor(wallet = null) {
        this.connection = new Connection(NETWORK_URL, 'confirmed');
        this.wallet = wallet;
    }

    // Set wallet (for when user connects wallet later)
    setWallet(wallet) {
        this.wallet = wallet;
    }

    // Helper to create instruction data
    createInstructionData(instructionType, data) {
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

    // Create a new medicine batch
    async createBatch(batchId, manufacturer) {
        if (!this.wallet) {
            throw new Error('Wallet not connected');
        }

        try {
            // Generate batch account keypair
            const batchAccount = Keypair.generate();

            // Create instruction data
            const instructionData = this.createInstructionData(0, {
                batch_id: batchId,
                manufacturer: manufacturer || this.wallet.publicKey.toString()
            });

            // Create transaction
            const transaction = new Transaction().add(
                new TransactionInstruction({
                    keys: [
                        { pubkey: this.wallet.publicKey, isSigner: true, isWritable: true },
                        { pubkey: batchAccount.publicKey, isSigner: true, isWritable: true },
                        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
                        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
                    ],
                    programId: PROGRAM_ID,
                    data: Buffer.from(instructionData),
                })
            );

            // Get recent blockhash
            const { blockhash } = await this.connection.getRecentBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = this.wallet.publicKey;

            // Sign with batch account
            transaction.partialSign(batchAccount);

            // Sign and send transaction
            const signedTransaction = await this.wallet.signTransaction(transaction);
            const signature = await this.connection.sendRawTransaction(signedTransaction.serialize());
            
            await this.connection.confirmTransaction(signature);

            return {
                success: true,
                signature,
                batchAccount: batchAccount.publicKey.toString(),
                message: 'Batch created successfully'
            };

        } catch (error) {
            console.error('CreateBatch error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Transfer ownership of a batch
    async transferOwnership(batchAccountAddress, batchId, newOwner) {
        if (!this.wallet) {
            throw new Error('Wallet not connected');
        }

        try {
            // Create signature (placeholder - implement proper signing)
            const signature = new Uint8Array(64).fill(0);

            const instructionData = this.createInstructionData(1, {
                batch_id: batchId,
                new_owner: newOwner,
                signature: Array.from(signature)
            });

            const transaction = new Transaction().add(
                new TransactionInstruction({
                    keys: [
                        { pubkey: this.wallet.publicKey, isSigner: true, isWritable: false },
                        { pubkey: new PublicKey(batchAccountAddress), isSigner: false, isWritable: true },
                    ],
                    programId: PROGRAM_ID,
                    data: Buffer.from(instructionData),
                })
            );

            const { blockhash } = await this.connection.getRecentBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = this.wallet.publicKey;

            const signedTransaction = await this.wallet.signTransaction(transaction);
            const txSignature = await this.connection.sendRawTransaction(signedTransaction.serialize());
            
            await this.connection.confirmTransaction(txSignature);

            return {
                success: true,
                signature: txSignature,
                message: 'Ownership transferred successfully'
            };

        } catch (error) {
            console.error('TransferOwnership error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Verify a batch
    async verifyBatch(batchId) {
        if (!this.wallet) {
            throw new Error('Wallet not connected');
        }

        try {
            const instructionData = this.createInstructionData(2, {
                batch_id: batchId
            });

            const transaction = new Transaction().add(
                new TransactionInstruction({
                    keys: [
                        { pubkey: this.wallet.publicKey, isSigner: true, isWritable: false },
                    ],
                    programId: PROGRAM_ID,
                    data: Buffer.from(instructionData),
                })
            );

            const { blockhash } = await this.connection.getRecentBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = this.wallet.publicKey;

            const signedTransaction = await this.wallet.signTransaction(transaction);
            const signature = await this.connection.sendRawTransaction(signedTransaction.serialize());
            
            await this.connection.confirmTransaction(signature);

            return {
                success: true,
                signature,
                message: 'Batch verified successfully'
            };

        } catch (error) {
            console.error('VerifyBatch error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get batch information
    async getBatchInfo(batchAccountAddress) {
        try {
            const accountInfo = await this.connection.getAccountInfo(new PublicKey(batchAccountAddress));
            
            if (!accountInfo) {
                return {
                    success: false,
                    error: 'Batch account not found'
                };
            }

            // Deserialize batch data (you'll need to implement the batch data structure)
            return {
                success: true,
                data: {
                    owner: accountInfo.owner.toString(),
                    lamports: accountInfo.lamports,
                    dataLength: accountInfo.data.length,
                    // Add batch-specific data parsing here
                }
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get connection status
    async getConnectionStatus() {
        try {
            const version = await this.connection.getVersion();
            return {
                connected: true,
                version: version['solana-core'],
                network: NETWORK_URL
            };
        } catch (error) {
            return {
                connected: false,
                error: error.message
            };
        }
    }
}

// React hook for using the service
export const useMedWeb3 = (wallet) => {
    const service = new MedWeb3Service(wallet);
    
    return {
        service,
        createBatch: service.createBatch.bind(service),
        transferOwnership: service.transferOwnership.bind(service),
        verifyBatch: service.verifyBatch.bind(service),
        getBatchInfo: service.getBatchInfo.bind(service),
        getConnectionStatus: service.getConnectionStatus.bind(service),
    };
};

export default MedWeb3Service;
