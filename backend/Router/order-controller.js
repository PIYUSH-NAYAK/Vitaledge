const Order = require('../Models/Order');
const Cart = require('../Models/Cart');
const Medicine = require('../Models/Medicine');
const { connection, wallet, web3 } = require('../Utils/solanaConnection');
const blockchainService = require('../Utils/blockchainService');
const QRCode = require('qrcode');

// ✅ Create new order
const createOrder = async (req, res) => {
    try {
        console.log('🛒 Creating order...');
        console.log('Request body:', req.body);
        console.log('User:', req.firebaseUser?.email);
        
        const userId = req.firebaseUser.uid;
        const userEmail = req.firebaseUser.email;
        
        const {
            shippingAddress,
            paymentDetails,
            notes,
            prescriptionUrl
        } = req.body;

        const cart = await Cart.findOne({ userId }).populate('items.medicineId');
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        const orderItems = [];
        let subtotal = 0;
        let prescriptionRequired = false;

        for (const item of cart.items) {
            const medicine = item.medicineId;
            
            if (!medicine || !medicine.isActive) {
                return res.status(400).json({
                    success: false,
                    message: `Medicine ${medicine?.name || 'Unknown'} is no longer available`
                });
            }

            if (medicine.stock.quantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${medicine.name}`
                });
            }

            if (medicine.prescriptionRequired) {
                prescriptionRequired = true;
            }

            const itemTotal = item.quantity * medicine.price.discountedPrice;
            subtotal += itemTotal;

            orderItems.push({
                medicineId: medicine._id,
                name: medicine.name,
                quantity: item.quantity,
                price: medicine.price.discountedPrice,
                batchNumber: medicine.batchNumber
            });

            // Update stock
            medicine.stock.quantity -= item.quantity;
            await medicine.save();
        }

        // Calculate pricing
        const taxes = Math.round(subtotal * 0.18); // 18% GST
        const deliveryCharges = subtotal > 500 ? 0 : 50; // Free delivery above ₹500
        const total = subtotal + taxes + deliveryCharges;

        // Generate unique order ID
        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const order = new Order({
            orderId,
            userId,
            userEmail,
            medicines: orderItems,
            pricing: {
                subtotal,
                taxes,
                deliveryCharges,
                total
            },
            shippingAddress,
            paymentDetails: {
                ...paymentDetails,
                amount: total,
                paidAt: new Date() // Add payment timestamp
            },
            orderStatus: paymentDetails.paymentStatus === 'confirmed' ? 'confirmed' : 'pending', // Set order status based on payment
            prescriptionRequired,
            prescriptionUploaded: !!prescriptionUrl,
            prescriptionUrl,
            notes,
            tracking: {
                trackingHistory: [{
                    timestamp: new Date(),
                    location: 'Order Placed',
                    status: paymentDetails.paymentStatus === 'confirmed' ? 'confirmed' : 'pending',
                    description: paymentDetails.paymentStatus === 'confirmed' 
                        ? 'Order confirmed - Payment received successfully' 
                        : 'Order has been placed successfully',
                    updatedBy: 'system'
                }]
            }
        });

        try {
            const { wallet } = require('../Utils/solanaConnection');
            
            const batchResult = await blockchainService.createMedicineBatch(
                order.orderId,
                wallet.publicKey.toString()
            );
            
            if (batchResult && batchResult.success) {
                order.blockchain = {
                    batchId: batchResult.batchAccount,
                    contractAddress: batchResult.batchAccount,
                    blockNumber: 0,
                    gasUsed: 0
                };
            }
        } catch (blockchainError) {
            console.error('Blockchain batch creation failed:', blockchainError.message);
            try {
                const BlockchainJob = require('../Models/BlockchainJob');
                const nextAttempt = new Date(Date.now() + 60 * 1000);
                await BlockchainJob.create({
                    jobType: 'createBatch',
                    orderId: order.orderId,
                    payload: { batchId: order.orderId, manufacturer: wallet.publicKey.toString() },
                    attempts: 0,
                    maxAttempts: 5,
                    status: 'pending',
                    nextAttemptAt: nextAttempt
                });
            } catch (jobErr) {
                console.error('Failed to create blockchain job:', jobErr.message);
            }
        }

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
        } catch (qrError) {
            console.error('QR code generation failed:', qrError.message);
        }

        await order.save();
        
        await Cart.findOneAndUpdate(
            { userId },
            { items: [] }
        );

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: {
                orderId: order.orderId,
                total: order.pricing.total,
                status: order.orderStatus,
                estimatedDelivery: order.tracking.estimatedDelivery,
                paymentStatus: order.paymentDetails.paymentStatus
            }
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
};

// ✅ Get user's orders
const getUserOrders = async (req, res) => {
    try {
        const userId = req.firebaseUser.uid;
        const { page = 1, limit = 10, status } = req.query;

        const filter = { userId };
        if (status) {
            filter.orderStatus = status;
        }

        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('medicines.medicineId', 'name images.primary');

        const total = await Order.countDocuments(filter);

        res.json({
            success: true,
            orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                total,
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

// ✅ Get single order details
const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.firebaseUser.uid;

        const order = await Order.findOne({ orderId, userId })
            .populate('medicines.medicineId', 'name images.primary category');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Fetch on-chain blockchain data if available
        let onChainData = null;
        try {
            if (order.blockchain && order.blockchain.batchId) {
                const onchain = await blockchainService.verifyBatch(order.blockchain.batchId);
                if (onchain && onchain.success) {
                    onChainData = onchain.decoded || null;
                }
            }
        } catch (e) {
            console.error('Error fetching on-chain data for order details:', e);
        }

        // Add on-chain data to blockchain object
        const orderData = order.toObject();
        if (onChainData && orderData.blockchain) {
            orderData.blockchain.onChainData = onChainData;
        }

        res.json({
            success: true,
            order: orderData
        });

    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order details',
            error: error.message
        });
    }
};

// ✅ Process blockchain payment
const processBlockchainPayment = async (req, res) => {
    try {
        const { orderId, transactionHash, walletAddress, blockchainNetwork } = req.body;
        const userId = req.firebaseUser.uid;

        const order = await Order.findOne({ orderId, userId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update payment details
        order.paymentDetails.transactionHash = transactionHash;
        order.paymentDetails.walletAddress = walletAddress;
        order.paymentDetails.blockchainNetwork = blockchainNetwork;
        order.paymentDetails.paymentStatus = 'confirmed';
        order.paymentDetails.paidAt = new Date();
        order.orderStatus = 'confirmed';

        // Add to tracking history
        order.tracking.trackingHistory.push({
            timestamp: new Date(),
            location: 'Payment Gateway',
            status: 'confirmed',
            description: 'Payment confirmed on blockchain',
            updatedBy: 'blockchain'
        });

        // Set estimated delivery (2-5 days from now)
        const estimatedDays = Math.floor(Math.random() * 4) + 2; // 2-5 days
        order.tracking.estimatedDelivery = new Date(Date.now() + estimatedDays * 24 * 60 * 60 * 1000);

        await order.save();

        res.json({
            success: true,
            message: 'Payment processed successfully',
            order: {
                orderId: order.orderId,
                paymentStatus: order.paymentDetails.paymentStatus,
                orderStatus: order.orderStatus,
                estimatedDelivery: order.tracking.estimatedDelivery
            }
        });

    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing payment',
            error: error.message
        });
    }
};

// ✅ Track order
const trackOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.firebaseUser.uid;

        const order = await Order.findOne({ orderId, userId })
            .select('orderId orderStatus tracking pricing.total createdAt');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            tracking: {
                orderId: order.orderId,
                status: order.orderStatus,
                currentLocation: order.tracking.currentLocation,
                trackingHistory: order.tracking.trackingHistory,
                estimatedDelivery: order.tracking.estimatedDelivery,
                deliveryPartner: order.tracking.deliveryPartner,
                orderDate: order.createdAt,
                totalAmount: order.pricing.total
            }
        });

    } catch (error) {
        console.error('Error tracking order:', error);
        res.status(500).json({
            success: false,
            message: 'Error tracking order',
            error: error.message
        });
    }
};

// ✅ Cancel order
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.firebaseUser.uid;

        const order = await Order.findOne({ orderId, userId }).populate('medicines.medicineId');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (!['pending', 'confirmed'].includes(order.orderStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Order cannot be cancelled at this stage'
            });
        }

        // Restore stock
        for (const item of order.medicines) {
            const medicine = await Medicine.findById(item.medicineId);
            if (medicine) {
                medicine.stock.quantity += item.quantity;
                await medicine.save();
            }
        }

        // Update order status
        order.orderStatus = 'cancelled';
        order.tracking.trackingHistory.push({
            timestamp: new Date(),
            location: 'System',
            status: 'cancelled',
            description: 'Order cancelled by user',
            updatedBy: userId
        });

        await order.save();

        res.json({
            success: true,
            message: 'Order cancelled successfully',
            order: {
                orderId: order.orderId,
                status: order.orderStatus
            }
        });

    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling order',
            error: error.message
        });
    }
};

// ✅ Verify order (public endpoint - no authentication required)
const verifyOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOne({ orderId })
            .populate('medicines.medicineId', 'name images.primary category')
            .select('-userId -userEmail'); // Don't expose user details publicly

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Optionally enrich blockchain data with on-chain decoded information
        let onChainData = null;
        try {
            if (order.blockchain && order.blockchain.batchId) {
                const onchain = await blockchainService.verifyBatch(order.blockchain.batchId);
                if (onchain && onchain.success) {
                    onChainData = onchain.decoded || null;
                }
            }
        } catch (e) {
            console.error('Error fetching on-chain batch data for verify endpoint:', e);
        }

        // Return limited information for public verification
        res.json({
            success: true,
            order: {
                orderId: order.orderId,
                orderStatus: order.orderStatus,
                createdAt: order.createdAt,
                medicines: order.medicines,
                pricing: order.pricing,
                shippingAddress: order.shippingAddress,
                paymentDetails: {
                    method: order.paymentDetails.method,
                    transactionHash: order.paymentDetails.transactionHash,
                    blockchainNetwork: order.paymentDetails.blockchainNetwork,
                    paymentStatus: order.paymentDetails.paymentStatus
                },
                tracking: order.tracking,
                blockchain: {
                    ...order.blockchain,
                    onChainData
                }
            }
        });

    } catch (error) {
        console.error('Error verifying order:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying order',
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderDetails,
    processBlockchainPayment,
    trackOrder,
    cancelOrder,
    verifyOrder
};
