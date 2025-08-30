const mongoose = require('mongoose');
const Order = require('../backend/Models/Order');

async function compareOrdersWithBlockchain() {
    try {
        // Connect to database
        await mongoose.connect('mongodb://localhost:27017/vitaledge');
        
        console.log('📊 Checking orders in database vs blockchain...\n');
        
        // Get recent orders
        const orders = await Order.find().sort({ createdAt: -1 }).limit(5);
        
        console.log(`🏥 Found ${orders.length} recent orders in database:\n`);
        
        orders.forEach((order, index) => {
            console.log(`Order ${index + 1}:`);
            console.log(`   Order ID: ${order.orderId}`);
            console.log(`   User: ${order.userEmail}`);
            console.log(`   Status: ${order.orderStatus}`);
            console.log(`   Total: $${order.pricing.total}`);
            console.log(`   Created: ${order.createdAt.toLocaleString()}`);
            
            if (order.blockchain) {
                console.log(`   🔗 Blockchain Data:`);
                console.log(`      Batch ID: ${order.blockchain.batchId}`);
                console.log(`      Contract Address: ${order.blockchain.contractAddress}`);
            } else {
                console.log(`   ⚠️  No blockchain data (order created without blockchain)`);
            }
            console.log('   ─────────────────────────────────────\n');
        });
        
        mongoose.disconnect();
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

compareOrdersWithBlockchain();
