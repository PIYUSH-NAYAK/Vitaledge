import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Buffer } from 'buffer';

// Make Buffer available globally for browser
window.Buffer = Buffer;

// Your deployed contract program ID
const PROGRAM_ID = new PublicKey('7e1SU615mkoWoQsx2HxxujKj9tU8QRF1hHD8gUiWuvWQ');
// Use devnet for testing, mainnet for production
const NETWORK_URL = import.meta.env.PROD 
  ? 'https://api.mainnet-beta.solana.com' 
  : 'https://api.devnet.solana.com';

class SolanaBlockchainService {
    constructor() {
        this.connection = new Connection(NETWORK_URL, 'confirmed');
        this.programId = PROGRAM_ID;
    }

    // Test connection to the deployed contract
    async testConnection() {
        try {
            console.log('🔍 Testing contract connection...');
            const programInfo = await this.connection.getAccountInfo(this.programId);
            
            if (programInfo) {
                console.log('✅ Contract is accessible!');
                console.log('Program ID:', this.programId.toString());
                console.log('Program Owner:', programInfo.owner.toString());
                console.log('Program Executable:', programInfo.executable);
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Error testing contract:', error);
            return false;
        }
    }

    // Create a medicine batch on blockchain
    async createMedicineBatch(walletAdapter, batchData) {
        try {
            if (!walletAdapter.connected) {
                throw new Error('Wallet not connected');
            }

            console.log('📦 Creating medicine batch on blockchain...');
            
            // Create instruction data (simplified for demo)
            const instructionData = Buffer.from(JSON.stringify({
                instruction: 'CreateBatch',
                batch_id: batchData.batchId,
                manufacturer: batchData.manufacturer,
                medicine_name: batchData.medicineName,
                production_date: batchData.productionDate,
                expiry_date: batchData.expiryDate
            }));

            // Create transaction
            const transaction = new Transaction();
            
            // Create instruction (simplified - in production use proper instruction format)
            const instruction = {
                keys: [
                    { pubkey: walletAdapter.publicKey, isSigner: true, isWritable: true },
                ],
                programId: this.programId,
                data: instructionData
            };

            transaction.add(instruction);

            // Send transaction
            const signature = await walletAdapter.sendTransaction(transaction, this.connection);
            
            console.log('✅ Medicine batch created! Signature:', signature);
            return { success: true, signature };

        } catch (error) {
            console.error('❌ Error creating batch:', error);
            return { success: false, error: error.message };
        }
    }

    // Verify medicine batch
    async verifyMedicineBatch(batchId) {
        try {
            console.log('🔍 Verifying medicine batch:', batchId);
            
            // In a real implementation, you would query the blockchain for batch data
            // For now, we'll simulate the verification
            const programAccounts = await this.connection.getProgramAccounts(this.programId);
            
            console.log('📊 Found', programAccounts.length, 'program accounts');
            
            // Simulate verification result
            return {
                success: true,
                verified: true,
                batchId,
                status: 'verified',
                onChain: programAccounts.length > 0
            };

        } catch (error) {
            console.error('❌ Error verifying batch:', error);
            return { success: false, error: error.message };
        }
    }

    // Get all medicine batches (for admin/dashboard)
    async getAllBatches() {
        try {
            const programAccounts = await this.connection.getProgramAccounts(this.programId);
            
            // In a real implementation, decode the account data
            return {
                success: true,
                batches: programAccounts.map((account, index) => ({
                    id: `batch_${index}`,
                    address: account.pubkey.toString(),
                    dataLength: account.account.data.length
                }))
            };

        } catch (error) {
            console.error('❌ Error fetching batches:', error);
            return { success: false, error: error.message };
        }
    }
}

export default new SolanaBlockchainService();
