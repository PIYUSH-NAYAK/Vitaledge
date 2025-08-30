const { Connection, PublicKey } = require('@solana/web3.js');

// Your deployed program ID
const PROGRAM_ID = new PublicKey('DBL4hbkkDsVHwDBSKGmA4ivneVR8Zf5RHmYHpE1XrR8x');

async function viewBlockchainOrders() {
    const connection = new Connection('http://localhost:8899', 'confirmed');
    
    console.log('🔍 Checking blockchain for medicine orders...\n');
    
    try {
        // Get all accounts associated with our program
        const programAccounts = await connection.getProgramAccounts(PROGRAM_ID);
        
        console.log(`📊 Found ${programAccounts.length} blockchain accounts for medicine tracking\n`);
        
        if (programAccounts.length > 0) {
            programAccounts.forEach((account, index) => {
                console.log(`🏥 Medicine Batch ${index + 1}:`);
                console.log(`   Account Address: ${account.pubkey.toString()}`);
                console.log(`   Data Length: ${account.account.data.length} bytes`);
                console.log(`   Owner: ${account.account.owner.toString()}`);
                console.log(`   Lamports: ${account.account.lamports}`);
                console.log(`   Executable: ${account.account.executable}`);
                console.log('   ─────────────────────────────────────\n');
            });
        } else {
            console.log('ℹ️  No medicine batches found on blockchain yet.');
            console.log('   This might be because:');
            console.log('   - Order creation had blockchain errors');
            console.log('   - Blockchain integration is still being processed');
            console.log('   - Check backend logs for blockchain errors\n');
        }
        
        // Check recent transactions
        console.log('🔄 Checking recent transactions...\n');
        const signatures = await connection.getSignaturesForAddress(PROGRAM_ID, { limit: 10 });
        
        if (signatures.length > 0) {
            console.log(`📝 Found ${signatures.length} recent transactions:\n`);
            signatures.forEach((sig, index) => {
                console.log(`Transaction ${index + 1}:`);
                console.log(`   Signature: ${sig.signature}`);
                console.log(`   Slot: ${sig.slot}`);
                console.log(`   Block Time: ${new Date(sig.blockTime * 1000).toLocaleString()}`);
                console.log(`   Status: ${sig.err ? 'Failed' : 'Success'}`);
                console.log('   ─────────────────────────────────────\n');
            });
        } else {
            console.log('ℹ️  No recent transactions found for the program.\n');
        }
        
        // Check wallet balance
        const walletPath = '/home/iso/solana-wallet/keypair.json';
        if (require('fs').existsSync(walletPath)) {
            const wallet = require('@solana/web3.js').Keypair.fromSecretKey(
                new Uint8Array(JSON.parse(require('fs').readFileSync(walletPath)))
            );
            
            const balance = await connection.getBalance(wallet.publicKey);
            console.log(`💰 Wallet Balance: ${balance / 1000000000} SOL`);
            console.log(`🔑 Wallet Address: ${wallet.publicKey.toString()}\n`);
        }
        
    } catch (error) {
        console.error('❌ Error checking blockchain:', error.message);
    }
}

viewBlockchainOrders();
