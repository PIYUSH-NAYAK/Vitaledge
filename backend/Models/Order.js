const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String, // Firebase UID
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    medicines: [{
        medicineId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Medicine',
            required: true
        },
        name: String,
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        },
        batchNumber: String
    }],
    pricing: {
        subtotal: {
            type: Number,
            required: true
        },
        taxes: {
            type: Number,
            default: 0
        },
        deliveryCharges: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            required: true
        }
    },
    shippingAddress: {
        fullName: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        addressLine1: {
            type: String,
            required: true
        },
        addressLine2: String,
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        landmark: String
    },
    paymentDetails: {
        method: {
            type: String,
            enum: ['solana', 'ethereum'],
            required: true
        },
        transactionHash: String,
        walletAddress: String,
        blockchainNetwork: String, // 'solana-devnet', 'ethereum-mainnet', etc.
        paymentStatus: {
            type: String,
            enum: ['pending', 'confirmed', 'failed'],
            default: 'pending'
        },
        paidAt: Date,
        amount: Number
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    tracking: {
        trackingNumber: String,
        currentLocation: {
            city: String,
            state: String,
            coordinates: {
                lat: Number,
                lng: Number
            }
        },
        trackingHistory: [{
            timestamp: {
                type: Date,
                default: Date.now
            },
            location: String,
            status: String,
            description: String,
            updatedBy: String
        }],
        estimatedDelivery: Date,
        deliveryPartner: String
    },
    prescriptionRequired: {
        type: Boolean,
        default: false
    },
    prescriptionUploaded: {
        type: Boolean,
        default: false
    },
    prescriptionUrl: String,
    notes: String,
    blockchain: {
        batchId: String, // From smart contract
        contractAddress: String,
        blockNumber: Number,
        gasUsed: Number
    },
    qrCode: {
        type: String, // Base64 encoded QR code image
        default: null
    }
}, {
    timestamps: true
});

// Generate unique order ID
orderSchema.pre('save', function(next) {
    if (!this.orderId) {
        this.orderId = 'VE' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
    }
    next();
});

// Index for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ 'tracking.trackingNumber': 1 });
orderSchema.index({ 'shippingAddress.city': 1 });

module.exports = mongoose.model('Order', orderSchema);
