import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

const PROGRAM_ID = new PublicKey('DBL4hbkkDsVHwDBSKGmA4ivneVR8Zf5RHmYHpE1XrR8x');

export class SolanaService {
    constructor() {
        this.connection = new Connection('http://localhost:8899', 'confirmed');
    }

    async createBatch(wallet, batchData) {
        if (!wallet.connected) throw new Error('Wallet not connected');
        
        const batchAccount = new PublicKey(); // Generate new account
        const instruction = {
            keys: [
                { pubkey: batchAccount, isSigner: true, isWritable: true },
                { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
            ],
            programId: PROGRAM_ID,
            data: new Uint8Array([0]) // CreateBatch instruction
        };

        const transaction = new Transaction().add(instruction);
        const signature = await wallet.sendTransaction(transaction, this.connection);
        await this.connection.confirmTransaction(signature);
        
        return { signature, batchId: batchAccount.toString() };
    }

    async verifyBatch(batchId) {
        try {
            const batchPubkey = new PublicKey(batchId);
            const accountInfo = await this.connection.getAccountInfo(batchPubkey);
            return accountInfo !== null;
        } catch {
            return false;
        }
    }
}
