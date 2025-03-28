require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const router = require('./Router/auth-router');
const connectDB = require('./Utils/db');

// ✅ CORS Configuration
var corsOptions = {
    origin: [
        'http://localhost:3000', // For Phantom/Frontend testing
        'http://localhost:5000', // For Postman testing
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200,
};

// ✅ Apply CORS middleware
app.use(cors(corsOptions));

// ✅ Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Use Routes
app.use('/', router);

// ✅ Default route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// ✅ Connect to DB and start the server
connectDB().then(() => {
    app.listen(7777, () => {
        console.log('✅ Server is running on port 7777');
    });
});
