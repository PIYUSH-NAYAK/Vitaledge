const web3 = require('@solana/web3.js');
const fs = require('fs');

// ✅ Load keypair with support for both file path (local) and env variable (production)
let wallet;
try {
  // Production: Check for SOLANA_PRIVATE_KEY environment variable first
  if (process.env.SOLANA_PRIVATE_KEY) {
    const secretKey = JSON.parse(process.env.SOLANA_PRIVATE_KEY);
    wallet = web3.Keypair.fromSecretKey(new Uint8Array(secretKey));
    console.log('✅ Solana wallet loaded from environment variable');
    console.log('📍 Wallet Address:', wallet.publicKey.toString());
  }
  // Local Development: Check for wallet file
  else if (process.env.SOLANA_WALLET_PATH && fs.existsSync(process.env.SOLANA_WALLET_PATH)) {
    const secretKey = JSON.parse(fs.readFileSync(process.env.SOLANA_WALLET_PATH));
    wallet = web3.Keypair.fromSecretKey(new Uint8Array(secretKey));
    console.log('✅ Solana wallet loaded from file');
    console.log('📍 Wallet Address:', wallet.publicKey.toString());
  } else {
    console.log('⚠️  Solana wallet not found, generating temporary wallet for development');
    wallet = web3.Keypair.generate();
    console.log('🔑 Temporary wallet address:', wallet.publicKey.toString());
    console.log('⚠️  WARNING: Using temporary wallet - transactions will not persist!');
    
    // Auto-fund temporary wallet on test validator
    setTimeout(async () => {
      try {
        const connection = new web3.Connection('http://localhost:8899', 'confirmed');
        const balance = await connection.getBalance(wallet.publicKey);
        
        if (balance === 0) {
          console.log('💰 Requesting airdrop for temporary wallet...');
          const signature = await connection.requestAirdrop(wallet.publicKey, 2 * web3.LAMPORTS_PER_SOL);
          await connection.confirmTransaction(signature);
          console.log('✅ Airdrop completed');
        }
      } catch (error) {
        console.log('⚠️  Airdrop failed (this is normal if not on test validator):', error.message);
      }
    }, 2000);
  }
} catch (error) {
  console.error('❌ Error loading Solana wallet, using temporary wallet:', error.message);
  wallet = web3.Keypair.generate();
  console.log('🔑 Temporary wallet address:', wallet.publicKey.toString());
}

// ✅ Connect to Solana Devnet - Where your contract is deployed
const connection = new web3.Connection('https://api.devnet.solana.com', 'confirmed');

console.log('🌐 Connected to Solana Devnet');
console.log('📍 Wallet Address:', wallet.publicKey.toString());

// ✅ Exporting connection and wallet
module.exports = {
  connection,
  wallet,
  web3,
};
