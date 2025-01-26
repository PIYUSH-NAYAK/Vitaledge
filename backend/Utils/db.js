const mongoose = require('mongoose');
// const dotenv = require('dotenv');

const URI = process.env.URI;

const connectDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log('Database Connected');
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;

