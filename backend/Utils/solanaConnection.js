const web3 = require('@solana/web3.js');
const fs = require('fs');

// ✅ Load keypair from generated wallet
const walletPath = process.env.SOLANA_WALLET_PATH || '/home/mod/solana-wallet/keypair.json';
const secretKey = JSON.parse(fs.readFileSync(walletPath));
const wallet = web3.Keypair.fromSecretKey(new Uint8Array(secretKey));

// ✅ Connect to Solana Network
const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');

// ✅ Exporting connection and wallet
module.exports = {
  connection,
  wallet,
  web3,
};
