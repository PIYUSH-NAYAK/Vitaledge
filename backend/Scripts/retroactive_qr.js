require('dotenv').config();
const connectDB = require('../Utils/db');
const Order = require('../Models/Order');
const QRCode = require('qrcode');

async function generateMissingQRCodes(limit = 100) {
  await connectDB();

  console.log('Searching for orders missing qrCode...');

  const filter = { $or: [ { qrCode: null }, { qrCode: { $exists: false } } ] };
  const orders = await Order.find(filter).limit(limit);

  if (!orders || orders.length === 0) {
    console.log('No orders found that are missing qrCode. Exiting.');
    process.exit(0);
  }

  console.log(`Found ${orders.length} orders without qrCode. Processing...`);

  for (const order of orders) {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${order.orderId}`;
      const qrCodeDataURL = await QRCode.toDataURL(verificationUrl, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 300,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      order.qrCode = qrCodeDataURL;
      await order.save();
      console.log(`✅ QR generated for order ${order.orderId}`);
    } catch (err) {
      console.error(`❌ Failed to generate QR for order ${order.orderId}:`, err.message);
    }
  }

  console.log('Done.');
  process.exit(0);
}

// Run with optional limit argument
const argLimit = parseInt(process.argv[2], 10) || 100;
generateMissingQRCodes(argLimit).catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
