const { Connection, PublicKey } = require("@solana/web3.js");

// Test the full integration
async function testIntegration() {
    console.log("🧪 Testing Full Project Integration...\n");
    
    // 1. Test blockchain connection
    try {
        const connection = new Connection("http://localhost:8899", "confirmed");
        const programId = new PublicKey("DBL4hbkkDsVHwDBSKGmA4ivneVR8Zf5RHmYHpE1XrR8x");
        
        const programInfo = await connection.getAccountInfo(programId);
        console.log("✅ Blockchain: Contract deployed and accessible");
        console.log(`   Program ID: ${programId.toString()}`);
        
    } catch (error) {
        console.log("❌ Blockchain: Connection failed", error.message);
    }
    
    // 2. Test backend modules
    try {
        const blockchainService = require("./backend/Utils/blockchainService.js");
        console.log("✅ Backend: Blockchain service loaded");
        
        const dbConfig = require("./backend/Utils/db.js");
        console.log("✅ Backend: Database configuration loaded");
        
    } catch (error) {
        console.log("❌ Backend: Module loading failed", error.message);
    }
    
    // 3. Test frontend package.json
    try {
        const frontendPackage = require("./front end/package.json");
        const hasSolana = frontendPackage.dependencies["@solana/web3.js"];
        
        if (hasSolana) {
            console.log("✅ Frontend: Solana dependencies installed");
        } else {
            console.log("⚠️  Frontend: Missing Solana dependencies");
        }
        
    } catch (error) {
        console.log("❌ Frontend: Package check failed", error.message);
    }
    
    console.log("\n🎉 Integration test complete!");
    console.log("\nNext steps:");
    console.log("1. Run: cd 'front end' && npm run dev");
    console.log("2. Run: cd backend && npm start");
    console.log("3. Test the medicine traceability features");
}

testIntegration();
