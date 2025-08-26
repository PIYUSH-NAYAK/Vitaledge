require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary Storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'vitaledge/medicines', // Organize uploads in folders
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
        transformation: [
            {
                width: 800,
                height: 600,
                crop: 'fill',
                quality: 'auto:good',
                fetch_format: 'auto' // Automatically deliver in optimal format
            }
        ],
        public_id: (req, file) => {
            // Generate unique filename
            const timestamp = Date.now();
            const originalName = file.originalname.split('.')[0];
            return `medicine_${originalName}_${timestamp}`;
        }
    }
});

// Configure multer with Cloudinary storage
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Helper function to delete image from Cloudinary
const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
};

// Helper function to get optimized image URL
const getOptimizedImageUrl = (publicId, options = {}) => {
    const defaultOptions = {
        width: 400,
        height: 300,
        crop: 'fill',
        quality: 'auto:good',
        fetch_format: 'auto'
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    return cloudinary.url(publicId, finalOptions);
};

module.exports = {
    cloudinary,
    upload,
    deleteImage,
    getOptimizedImageUrl
};
