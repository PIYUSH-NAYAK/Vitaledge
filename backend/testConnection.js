const { connection, wallet, web3 } = require('./Utils/solanaConnection');

async function checkBalance() {
    try {
        const balance = await connection.getBalance(wallet.publicKey);
        console.log(`✅ Wallet Address: ${wallet.publicKey.toBase58()}`);
        console.log(`✅ Wallet Balance: ${balance / web3.LAMPORTS_PER_SOL} SOL`);
    } catch (error) {
        console.error('❌ Error checking balance:', error);
    }
}

checkBalance();
