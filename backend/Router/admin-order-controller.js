const Order = require('../Models/Order');
const blockchainService = require('../Utils/blockchainService');
const { wallet } = require('../Utils/solanaConnection');

// List orders with pagination and optional status filter
const listOrders = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, q } = req.query;
    const filter = {};

    if (status) filter.orderStatus = status;
    if (q) {
      // simple text search on orderId or userEmail
      filter.$or = [
        { orderId: { $regex: q, $options: 'i' } },
        { userEmail: { $regex: q, $options: 'i' } }
      ];
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({ success: true, orders, pagination: { page: parseInt(page), limit: parseInt(limit), total } });
  } catch (error) {
    console.error('Error listing orders (admin):', error);
    res.status(500).json({ success: false, message: 'Error listing orders', error: error.message });
  }
};

// Get single order by orderId
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId }).populate('medicines.medicineId');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order (admin):', error);
    res.status(500).json({ success: false, message: 'Error fetching order', error: error.message });
  }
};

// Update order status (e.g., processing, shipped, delivered)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;

    if (!status) return res.status(400).json({ success: false, message: 'Status is required' });

    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.orderStatus = status;
    order.tracking.trackingHistory.push({
      timestamp: new Date(),
      location: 'Admin',
      status,
      description: note || `Status changed to ${status} by admin`,
      updatedBy: req.firebaseUser?.email || 'admin'
    });

    await order.save();

    res.json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    console.error('Error updating order status (admin):', error);
    res.status(500).json({ success: false, message: 'Error updating order status', error: error.message });
  }
};

// Transfer ownership on-chain for a batch associated with an order
const transferOwnership = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newOwner } = req.body;

    if (!newOwner) return res.status(400).json({ success: false, message: 'newOwner (pubkey) is required' });

    const order = await Order.findOne({ orderId });
    if (!order || !order.blockchain || !order.blockchain.batchId) {
      return res.status(404).json({ success: false, message: 'Order or associated blockchain batch not found' });
    }

    const batchId = order.blockchain.batchId;

    // Use server wallet as signer (will succeed only if server wallet is current owner)
    const result = await blockchainService.transferBatchOwnership(batchId, newOwner, wallet);

    if (!result || !result.success) {
      return res.status(500).json({ success: false, message: 'Blockchain transfer failed', error: result.error || 'unknown' });
    }

    // Optionally update order.blockchain metadata with new owner
    order.blockchain.currentOwner = newOwner;
    await order.save();

    res.json({ success: true, message: 'Ownership transferred on-chain', result, order });
  } catch (error) {
    console.error('Error transferring ownership (admin):', error);
    res.status(500).json({ success: false, message: 'Error transferring ownership', error: error.message });
  }
};

module.exports = {
  listOrders,
  getOrderById,
  updateOrderStatus,
  transferOwnership
};
