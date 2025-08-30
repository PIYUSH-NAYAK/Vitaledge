const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: String, // Firebase UID
        required: true,
        unique: true
    },
    items: [{
        medicineId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Medicine',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            max: 99
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    totalItems: {
        type: Number,
        default: 0
    },
    estimatedTotal: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Calculate total items and estimated total before saving
cartSchema.pre('save', function(next) {
    this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
    next();
});

// Method to add item to cart
cartSchema.methods.addItem = function(medicineId, quantity) {
    const existingItemIndex = this.items.findIndex(
        item => item.medicineId.toString() === medicineId.toString()
    );

    if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        this.items[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        this.items.push({ medicineId, quantity });
    }
    
    return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(medicineId) {
    this.items = this.items.filter(
        item => item.medicineId.toString() !== medicineId.toString()
    );
    return this.save();
};

// Method to update item quantity
cartSchema.methods.updateQuantity = function(medicineId, quantity) {
    const itemIndex = this.items.findIndex(
        item => item.medicineId.toString() === medicineId.toString()
    );

    if (itemIndex !== -1) {
        if (quantity <= 0) {
            this.items.splice(itemIndex, 1);
        } else {
            this.items[itemIndex].quantity = quantity;
        }
    }
    
    return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
    this.items = [];
    return this.save();
};

module.exports = mongoose.model('Cart', cartSchema);
