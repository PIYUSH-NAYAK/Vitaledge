const Address = require('../Models/Address');

// Get all addresses for the authenticated user
const getAddresses = async (req, res) => {
    try {
        const userId = req.firebaseUser.uid;
        
        const addresses = await Address.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({ addresses: addresses || [] });
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ message: 'Failed to fetch addresses' });
    }
};

// Add a new address
const addAddress = async (req, res) => {
    try {
        const { fullName, phone, addressLine1, addressLine2, city, state, pincode, landmark, isDefault } = req.body;
        const userId = req.firebaseUser.uid;

        // Validate required fields
        if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // If setting as default, unset other default addresses
        if (isDefault) {
            await Address.updateMany({ userId }, { isDefault: false });
        }

        // Check if this is the first address for the user
        const existingAddresses = await Address.find({ userId });
        const makeDefault = isDefault || existingAddresses.length === 0;

        // Create new address
        const newAddress = new Address({
            userId,
            fullName,
            phone,
            addressLine1,
            addressLine2: addressLine2 || '',
            city,
            state,
            pincode,
            landmark: landmark || '',
            isDefault: makeDefault
        });

        await newAddress.save();

        // Return all addresses
        const addresses = await Address.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({ 
            message: 'Address added successfully',
            addresses: addresses 
        });
    } catch (error) {
        console.error('Error adding address:', error);
        res.status(500).json({ message: 'Failed to add address' });
    }
};

// Update an address
const updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const { fullName, phone, addressLine1, addressLine2, city, state, pincode, landmark } = req.body;
        const userId = req.firebaseUser.uid;

        const address = await Address.findOne({ _id: addressId, userId });
        
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Update address fields
        if (fullName) address.fullName = fullName;
        if (phone) address.phone = phone;
        if (addressLine1) address.addressLine1 = addressLine1;
        if (addressLine2 !== undefined) address.addressLine2 = addressLine2;
        if (city) address.city = city;
        if (state) address.state = state;
        if (pincode) address.pincode = pincode;
        if (landmark !== undefined) address.landmark = landmark;

        await address.save();

        // Return all addresses
        const addresses = await Address.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({ 
            message: 'Address updated successfully',
            addresses: addresses 
        });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ message: 'Failed to update address' });
    }
};

// Delete an address
const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const userId = req.firebaseUser.uid;

        const address = await Address.findOne({ _id: addressId, userId });
        
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        const wasDefault = address.isDefault;

        // Delete the address
        await Address.deleteOne({ _id: addressId, userId });

        // If deleted address was default, set first remaining address as default
        if (wasDefault) {
            const firstAddress = await Address.findOne({ userId }).sort({ createdAt: -1 });
            if (firstAddress) {
                firstAddress.isDefault = true;
                await firstAddress.save();
            }
        }

        // Return all remaining addresses
        const addresses = await Address.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({ 
            message: 'Address deleted successfully',
            addresses: addresses 
        });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ message: 'Failed to delete address' });
    }
};

// Set an address as default
const setDefaultAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const userId = req.firebaseUser.uid;

        const address = await Address.findOne({ _id: addressId, userId });
        
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Unset all other default addresses
        await Address.updateMany({ userId }, { isDefault: false });

        // Set this address as default
        address.isDefault = true;
        await address.save();

        // Return all addresses
        const addresses = await Address.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({ 
            message: 'Default address updated successfully',
            addresses: addresses 
        });
    } catch (error) {
        console.error('Error setting default address:', error);
        res.status(500).json({ message: 'Failed to set default address' });
    }
};

module.exports = {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};
