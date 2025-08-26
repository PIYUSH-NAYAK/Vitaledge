const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    genericName: {
        type: String,
        required: true,
        trim: true
    },
    manufacturer: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    category: {
        type: String,
        required: true,
        enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops', 'Powder', 'Other']
    },
    dosage: {
        strength: {
            type: String,
            required: true // e.g., "500mg", "10ml"
        },
        form: {
            type: String,
            required: true // e.g., "Tablet", "Capsule"
        }
    },
    price: {
        mrp: {
            type: Number,
            required: true
        },
        discountedPrice: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            default: 0 // percentage
        }
    },
    images: {
        primary: {
            url: {
                type: String,
                required: true
            },
            publicId: {
                type: String,
                required: true
            }
        },
        gallery: [{
            url: {
                type: String,
                required: true
            },
            publicId: {
                type: String,
                required: true
            },
            caption: {
                type: String,
                default: ''
            }
        }]
    },
    stock: {
        quantity: {
            type: Number,
            required: true,
            min: 0
        },
        unit: {
            type: String,
            required: true,
            enum: ['pieces', 'bottles', 'tubes', 'packets']
        }
    },
    prescriptionRequired: {
        type: Boolean,
        default: false
    },
    activeIngredients: [{
        name: String,
        quantity: String
    }],
    sideEffects: [String],
    contraindications: [String],
    usage: {
        dosageInstructions: String,
        frequency: String,
        duration: String
    },
    storage: {
        temperature: String,
        conditions: String
    },
    expiryDate: {
        type: Date,
        required: true
    },
    batchNumber: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tags: [String], // for search optimization
    slug: {
        type: String,
        unique: true,
        required: true // for SEO-friendly URLs
    }
}, {
    timestamps: true
});

// Create slug before saving
medicineSchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
    next();
});

// Calculate discount percentage
medicineSchema.pre('save', function(next) {
    if (this.price.mrp && this.price.discountedPrice) {
        this.price.discount = Math.round(
            ((this.price.mrp - this.price.discountedPrice) / this.price.mrp) * 100
        );
    }
    next();
});

// Indexes for better search performance
medicineSchema.index({ name: 'text', genericName: 'text', tags: 'text' });
medicineSchema.index({ category: 1 });
medicineSchema.index({ slug: 1 });
medicineSchema.index({ isActive: 1 });

module.exports = mongoose.model('Medicine', medicineSchema);
