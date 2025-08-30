const { Connection, Keypair } = require('@solana/web3.js');
const fs = require('fs');

async function fundWalletForTestValidator() {
    try {
        console.log('💰 Funding wallet for test validator...\n');
        
        // Load the wallet
        const walletPath = '/home/iso/solana-wallet/keypair.json';
        const secretKey = JSON.parse(fs.readFileSync(walletPath));
        const wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
        
        // Connect to test validator
        const connection = new Connection('http://localhost:8899', 'confirmed');
        
        console.log(`🔑 Wallet Address: ${wallet.publicKey.toString()}`);
        
        // Check current balance
        const currentBalance = await connection.getBalance(wallet.publicKey);
        console.log(`💳 Current Balance: ${currentBalance / 1000000000} SOL`);
        
        if (currentBalance < 1000000000) { // Less than 1 SOL
            console.log('📡 Requesting airdrop...');
            
            const signature = await connection.requestAirdrop(
                wallet.publicKey, 
                5 * 1000000000 // 5 SOL
            );
            
            console.log(`🔄 Airdrop signature: ${signature}`);
            
            // Wait for confirmation
            await connection.confirmTransaction(signature);
            
            // Check new balance
            const newBalance = await connection.getBalance(wallet.publicKey);
            console.log(`✅ New Balance: ${newBalance / 1000000000} SOL`);
            
        } else {
            console.log('✅ Wallet already has sufficient balance!');
        }
        
    } catch (error) {
        console.error('❌ Error funding wallet:', error.message);
    }
}

fundWalletForTestValidator();
