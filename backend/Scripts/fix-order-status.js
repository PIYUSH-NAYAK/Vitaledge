const mongoose = require('mongoose');
const Order = require('../Models/Order');

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vitaledge');
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

// Fix order statuses where payment is confirmed but order status is pending
async function fixOrderStatuses() {
    try {
        console.log('🔍 Searching for orders with confirmed payment but pending status...');
        
        const ordersToFix = await Order.find({
            'paymentDetails.paymentStatus': 'confirmed',
            'orderStatus': 'pending'
        });

        console.log(`📊 Found ${ordersToFix.length} orders to fix`);

        if (ordersToFix.length > 0) {
            for (const order of ordersToFix) {
                console.log(`🔧 Fixing order ${order.orderId}...`);
                
                // Update order status to confirmed
                order.orderStatus = 'confirmed';
                
                // Update tracking history
                order.tracking.trackingHistory.push({
                    timestamp: new Date(),
                    location: 'Status Updated',
                    status: 'confirmed',
                    description: 'Order status updated to confirmed - Payment verified',
                    updatedBy: 'system-fix'
                });

                await order.save();
                console.log(`✅ Fixed order ${order.orderId}`);
            }

            console.log(`🎉 Successfully fixed ${ordersToFix.length} orders!`);
        } else {
            console.log('✅ No orders need fixing - all confirmed payments have correct status');
        }

    } catch (error) {
        console.error('❌ Error fixing orders:', error);
    }
}

// Main function
async function main() {
    await connectDB();
    await fixOrderStatuses();
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
}

// Run the script
main().catch(console.error);
