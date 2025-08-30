const Cart = require('../Models/Cart');
const Medicine = require('../Models/Medicine');

// ✅ Get user's cart
const getCart = async (req, res) => {
    try {
        const userId = req.firebaseUser.uid;
        
        let cart = await Cart.findOne({ userId }).populate({
            path: 'items.medicineId',
            select: 'name price images.primary stock category prescriptionRequired'
        });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
            await cart.save();
        }

        // Calculate estimated total
        let estimatedTotal = 0;
        const validItems = [];

        for (const item of cart.items) {
            if (item.medicineId && item.medicineId.stock.quantity > 0) {
                const itemTotal = item.quantity * item.medicineId.price.discountedPrice;
                estimatedTotal += itemTotal;
                validItems.push({
                    ...item.toObject(),
                    itemTotal
                });
            }
        }

        // Update cart with valid items only
        if (validItems.length !== cart.items.length) {
            cart.items = validItems.map(item => ({
                medicineId: item.medicineId._id,
                quantity: item.quantity,
                addedAt: item.addedAt
            }));
            cart.estimatedTotal = estimatedTotal;
            await cart.save();
        } else {
            cart.estimatedTotal = estimatedTotal;
            await cart.save();
        }

        res.json({
            success: true,
            cart: {
                ...cart.toObject(),
                items: validItems,
                estimatedTotal
            }
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching cart', 
            error: error.message 
        });
    }
};

// ✅ Add item to cart
const addToCart = async (req, res) => {
    try {
        const userId = req.firebaseUser.uid;
        const { medicineId, quantity = 1 } = req.body;

        // Validate medicine exists and is in stock
        const medicine = await Medicine.findById(medicineId);
        if (!medicine || !medicine.isActive) {
            return res.status(404).json({ 
                success: false, 
                message: 'Medicine not found' 
            });
        }

        if (medicine.stock.quantity < quantity) {
            return res.status(400).json({ 
                success: false, 
                message: 'Insufficient stock available' 
            });
        }

        // Get or create cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        await cart.addItem(medicineId, quantity);

        // Populate cart for response
        await cart.populate({
            path: 'items.medicineId',
            select: 'name price images.primary stock category'
        });

        res.json({
            success: true,
            message: 'Item added to cart',
            cart
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error adding item to cart', 
            error: error.message 
        });
    }
};

// ✅ Update cart item quantity
const updateCartItem = async (req, res) => {
    try {
        const userId = req.firebaseUser.uid;
        const { medicineId, quantity } = req.body;

        if (quantity < 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Quantity cannot be negative' 
            });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                message: 'Cart not found' 
            });
        }

        await cart.updateQuantity(medicineId, quantity);

        // Populate cart for response
        await cart.populate({
            path: 'items.medicineId',
            select: 'name price images.primary stock category'
        });

        res.json({
            success: true,
            message: 'Cart updated',
            cart
        });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating cart', 
            error: error.message 
        });
    }
};

// ✅ Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.firebaseUser.uid;
        const { medicineId } = req.params;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                message: 'Cart not found' 
            });
        }

        await cart.removeItem(medicineId);

        // Populate cart for response
        await cart.populate({
            path: 'items.medicineId',
            select: 'name price images.primary stock category'
        });

        res.json({
            success: true,
            message: 'Item removed from cart',
            cart
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error removing item from cart', 
            error: error.message 
        });
    }
};

// ✅ Clear entire cart
const clearCart = async (req, res) => {
    try {
        const userId = req.firebaseUser.uid;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                message: 'Cart not found' 
            });
        }

        await cart.clearCart();

        res.json({
            success: true,
            message: 'Cart cleared',
            cart
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error clearing cart', 
            error: error.message 
        });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
