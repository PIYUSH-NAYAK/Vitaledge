const mongoose = require('mongoose');
require('dotenv').config();

// Support common env var names for MongoDB connection string
const URI = process.env.URI || process.env.MONGODB_URI || process.env.DATABASE_URL || process.env.MONGO_URI;

const connectDB = async () => {
    if (!URI) {
        const msg = 'MongoDB connection string is not set. Please set one of: URI, MONGODB_URI, MONGO_URI or DATABASE_URL in your environment or .env file.';
        console.error(msg);
        throw new Error(msg);
    }

    try {
        await mongoose.connect(URI);

      
        console.log('✅ Database Connected');
    } catch (error) {
        console.error('❌ Database connection error:', error.message || error);
        throw error;
    }
}

module.exports = connectDB;

