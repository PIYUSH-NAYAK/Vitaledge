const Medicine = require('../Models/Medicine');
const { upload, deleteImage, getOptimizedImageUrl } = require('../config/cloudinary');

// ✅ Get all medicines with pagination and filtering
const getMedicines = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 12, 
            category, 
            search, 
            minPrice, 
            maxPrice,
            prescriptionRequired,
            sort = 'createdAt'
        } = req.query;

        const skip = (page - 1) * limit;
        
        // Build filter object
        let filter = { isActive: true };
        
        if (category) {
            filter.category = category;
        }
        
        if (search) {
            filter.$text = { $search: search };
        }
        
        if (minPrice || maxPrice) {
            filter['price.discountedPrice'] = {};
            if (minPrice) filter['price.discountedPrice'].$gte = Number(minPrice);
            if (maxPrice) filter['price.discountedPrice'].$lte = Number(maxPrice);
        }
        
        if (prescriptionRequired !== undefined) {
            filter.prescriptionRequired = prescriptionRequired === 'true';
        }

        // Build sort object
        let sortObj = {};
        switch (sort) {
            case 'price_low_high':
                sortObj = { 'price.discountedPrice': 1 };
                break;
            case 'price_high_low':
                sortObj = { 'price.discountedPrice': -1 };
                break;
            case 'name':
                sortObj = { name: 1 };
                break;
            case 'newest':
                sortObj = { createdAt: -1 };
                break;
            default:
                sortObj = { createdAt: -1 };
        }

        const medicines = await Medicine.find(filter)
            .select('-__v -sideEffects -contraindications -usage -storage') // Exclude detailed fields for listing
            .sort(sortObj)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Medicine.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        res.json({
            medicines,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                total,
                hasMore: page < totalPages,
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error fetching medicines:', error);
        res.status(500).json({ message: 'Error fetching medicines', error: error.message });
    }
};

// ✅ Get single medicine by ID or slug
const getMedicineDetails = async (req, res) => {
    try {
        const { identifier } = req.params; // Can be ID or slug
        
        let medicine;
        
        // Check if identifier is a valid ObjectId
        if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
            medicine = await Medicine.findById(identifier);
        } else {
            // Otherwise, search by slug
            medicine = await Medicine.findOne({ slug: identifier, isActive: true });
        }
        
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        res.json(medicine);
    } catch (error) {
        console.error('Error fetching medicine details:', error);
        res.status(500).json({ message: 'Error fetching medicine details', error: error.message });
    }
};

// ✅ Add new medicine (Admin only)
const addMedicine = async (req, res) => {
    try {
        const medicineData = req.body;
        
        // Validate required fields
        const requiredFields = ['name', 'genericName', 'manufacturer', 'description', 'category'];
        for (const field of requiredFields) {
            if (!medicineData[field]) {
                return res.status(400).json({ message: `${field} is required` });
            }
        }

        const newMedicine = new Medicine(medicineData);
        const savedMedicine = await newMedicine.save();
        
        res.status(201).json({ 
            message: 'Medicine added successfully', 
            medicine: savedMedicine 
        });
    } catch (error) {
        console.error('Error adding medicine:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Validation error', errors });
        }
        
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Medicine with this name already exists' });
        }
        
        res.status(500).json({ message: 'Error adding medicine', error: error.message });
    }
};

// ✅ Update medicine (Admin only)
const updateMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const medicine = await Medicine.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );
        
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        
        res.json({ 
            message: 'Medicine updated successfully', 
            medicine 
        });
    } catch (error) {
        console.error('Error updating medicine:', error);
        res.status(500).json({ message: 'Error updating medicine', error: error.message });
    }
};

// ✅ Delete medicine (Admin only)
const deleteMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Soft delete by setting isActive to false
        const medicine = await Medicine.findByIdAndUpdate(
            id, 
            { isActive: false }, 
            { new: true }
        );
        
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        
        res.json({ message: 'Medicine deleted successfully' });
    } catch (error) {
        console.error('Error deleting medicine:', error);
        res.status(500).json({ message: 'Error deleting medicine', error: error.message });
    }
};

// ✅ Get medicine categories
const getCategories = async (req, res) => {
    try {
        const categories = await Medicine.distinct('category', { isActive: true });
        res.json({ categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};

// ✅ Search medicines with autocomplete
const searchMedicines = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.length < 2) {
            return res.json({ suggestions: [] });
        }
        
        const suggestions = await Medicine.find({
            $and: [
                { isActive: true },
                {
                    $or: [
                        { name: { $regex: q, $options: 'i' } },
                        { genericName: { $regex: q, $options: 'i' } },
                        { tags: { $regex: q, $options: 'i' } }
                    ]
                }
            ]
        })
        .select('name genericName slug images.primary')
        .limit(10);
        
        res.json({ suggestions });
    } catch (error) {
        console.error('Error searching medicines:', error);
        res.status(500).json({ message: 'Error searching medicines', error: error.message });
    }
};

// ✅ Add medicine with image upload
const addMedicineWithImages = async (req, res) => {
    try {
        const medicineData = JSON.parse(req.body.medicineData);
        
        // Validate required fields
        const requiredFields = ['name', 'genericName', 'manufacturer', 'description', 'category'];
        for (const field of requiredFields) {
            if (!medicineData[field]) {
                return res.status(400).json({ message: `${field} is required` });
            }
        }
        
        // Handle uploaded images
        const images = {
            primary: null,
            gallery: []
        };
        
        if (req.files && req.files.length > 0) {
            // First image is primary
            images.primary = {
                url: req.files[0].path,
                publicId: req.files[0].filename
            };
            
            // Rest are gallery images
            if (req.files.length > 1) {
                images.gallery = req.files.slice(1).map(file => ({
                    url: file.path,
                    publicId: file.filename,
                    caption: ''
                }));
            }
        } else {
            return res.status(400).json({ message: 'At least one image is required' });
        }
        
        // Create medicine with images
        const medicine = new Medicine({
            ...medicineData,
            images,
            slug: medicineData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
        });
        
        await medicine.save();
        res.status(201).json({ 
            message: 'Medicine added successfully!', 
            medicine: medicine 
        });
    } catch (error) {
        console.error('Error adding medicine:', error);
        
        // Clean up uploaded images if medicine creation failed
        if (req.files) {
            for (const file of req.files) {
                await deleteImage(file.filename).catch(err => 
                    console.error('Error deleting image:', err)
                );
            }
        }
        
        res.status(500).json({ message: 'Error adding medicine', error: error.message });
    }
};

// ✅ Update medicine images
const updateMedicineImages = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // 'replace_primary', 'add_gallery', 'remove_gallery'
        
        const medicine = await Medicine.findById(id);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        
        if (action === 'replace_primary' && req.file) {
            // Delete old primary image
            if (medicine.images.primary) {
                await deleteImage(medicine.images.primary.publicId);
            }
            
            // Set new primary image
            medicine.images.primary = {
                url: req.file.path,
                publicId: req.file.filename
            };
        } else if (action === 'add_gallery' && req.files) {
            // Add new gallery images
            const newGalleryImages = req.files.map(file => ({
                url: file.path,
                publicId: file.filename,
                caption: ''
            }));
            
            medicine.images.gallery.push(...newGalleryImages);
        }
        
        await medicine.save();
        res.json({ message: 'Images updated successfully', medicine });
    } catch (error) {
        console.error('Error updating images:', error);
        res.status(500).json({ message: 'Error updating images', error: error.message });
    }
};

// ✅ Delete medicine image
const deleteMedicineImage = async (req, res) => {
    try {
        const { id, imageId } = req.params;
        
        const medicine = await Medicine.findById(id);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        
        // Find and remove image from gallery
        const imageIndex = medicine.images.gallery.findIndex(
            img => img._id.toString() === imageId
        );
        
        if (imageIndex === -1) {
            return res.status(404).json({ message: 'Image not found' });
        }
        
        const imageToDelete = medicine.images.gallery[imageIndex];
        
        // Delete from Cloudinary
        await deleteImage(imageToDelete.publicId);
        
        // Remove from database
        medicine.images.gallery.splice(imageIndex, 1);
        await medicine.save();
        
        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Error deleting image', error: error.message });
    }
};

// ✅ Update medicine stock (Admin only)
const updateMedicineStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;

        // Validate stock value
        if (typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Stock must be a non-negative number' 
            });
        }

        // Find and update medicine
        const medicine = await Medicine.findById(id);
        if (!medicine) {
            return res.status(404).json({ 
                success: false, 
                message: 'Medicine not found' 
            });
        }

        // Update stock quantity (keep the existing unit)
        medicine.stock.quantity = stock;
        await medicine.save();

        res.json({ 
            success: true, 
            message: 'Stock updated successfully',
            medicine: {
                _id: medicine._id,
                name: medicine.name,
                stock: medicine.stock
            }
        });
    } catch (error) {
        console.error('Error updating stock:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating stock', 
            error: error.message 
        });
    }
};

module.exports = {
    getMedicines,
    getMedicineDetails,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    getCategories,
    searchMedicines,
    addMedicineWithImages,
    updateMedicineImages,
    deleteMedicineImage,
    updateMedicineStock,
    // Export multer upload middleware
    uploadMiddleware: upload
};
