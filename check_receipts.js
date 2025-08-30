const mongoose = require('mongoose');
const Order = require('./backend/Models/Order');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/vitaledge-pro')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    checkOrders();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

async function checkOrders() {
  try {
    console.log('🔍 Checking orders for receipt information...\n');
    
    const orders = await Order.find({})
      .select('orderId orderStatus paymentDetails.paymentStatus paymentDetails.transactionHash paymentDetails.blockchainNetwork paymentDetails.method')
      .sort({ createdAt: -1 })
      .limit(10);

    if (orders.length === 0) {
      console.log('📭 No orders found in database.');
      return;
    }

    console.log(`📦 Found ${orders.length} recent orders:\n`);
    
    orders.forEach((order, index) => {
      console.log(`${index + 1}. Order ID: ${order.orderId}`);
      console.log(`   Order Status: ${order.orderStatus}`);
      console.log(`   Payment Status: ${order.paymentDetails.paymentStatus}`);
      console.log(`   Payment Method: ${order.paymentDetails.method}`);
      console.log(`   Transaction Hash: ${order.paymentDetails.transactionHash || 'NOT SET ❌'}`);
      console.log(`   Blockchain Network: ${order.paymentDetails.blockchainNetwork || 'NOT SET ❌'}`);
      
      // Check if receipt link can be generated
      if (order.paymentDetails.transactionHash) {
        const txHash = order.paymentDetails.transactionHash;
        const network = order.paymentDetails.blockchainNetwork;
        
        let receiptUrl = '';
        if (network?.includes('solana')) {
          receiptUrl = `https://explorer.solana.com/tx/${txHash}?cluster=devnet`;
        } else if (network?.includes('ethereum')) {
          receiptUrl = `https://sepolia.etherscan.io/tx/${txHash}`;
        }
        
        if (receiptUrl) {
          console.log(`   📋 Receipt URL: ${receiptUrl}`);
          console.log(`   ✅ Receipt functionality: WORKING`);
        } else {
          console.log(`   ❌ Receipt functionality: BROKEN (no network info)`);
        }
      } else {
        console.log(`   ❌ Receipt functionality: BROKEN (no transaction hash)`);
      }
      
      console.log('');
    });

    // Summary
    const ordersWithReceipts = orders.filter(o => o.paymentDetails.transactionHash && o.paymentDetails.blockchainNetwork);
    const ordersWithoutReceipts = orders.filter(o => !o.paymentDetails.transactionHash || !o.paymentDetails.blockchainNetwork);
    
    console.log('\n📊 SUMMARY:');
    console.log(`✅ Orders with working receipts: ${ordersWithReceipts.length}`);
    console.log(`❌ Orders with broken receipts: ${ordersWithoutReceipts.length}`);
    
    if (ordersWithoutReceipts.length > 0) {
      console.log('\n🔧 ISSUES FOUND:');
      ordersWithoutReceipts.forEach(order => {
        const issues = [];
        if (!order.paymentDetails.transactionHash) issues.push('Missing transaction hash');
        if (!order.paymentDetails.blockchainNetwork) issues.push('Missing blockchain network');
        console.log(`   Order ${order.orderId}: ${issues.join(', ')}`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking orders:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}
