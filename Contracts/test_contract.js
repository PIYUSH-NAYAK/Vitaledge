const { Connection, PublicKey } = require("@solana/web3.js");

const PROGRAM_ID = new PublicKey("DBL4hbkkDsVHwDBSKGmA4ivneVR8Zf5RHmYHpE1XrR8x");

async function testContract() {
    const connection = new Connection("http://localhost:8899", "confirmed");
    
    console.log("🔍 Testing deployed contract...");
    console.log("Program ID:", PROGRAM_ID.toString());
    
    try {
        const programInfo = await connection.getAccountInfo(PROGRAM_ID);
        
        if (programInfo) {
            console.log("✅ Contract is deployed!");
            console.log("Program Owner:", programInfo.owner.toString());
            console.log("Program Data Length:", programInfo.data.length);
            console.log("Program Executable:", programInfo.executable);
            
            // Get program accounts
            const programAccounts = await connection.getProgramAccounts(PROGRAM_ID);
            console.log("📊 Program Accounts Count:", programAccounts.length);
            
        } else {
            console.log("❌ Contract not found");
        }
        
    } catch (error) {
        console.error("Error testing contract:", error);
    }
}

testContract();
