require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const router = require('./Router/auth-router');
const adminRouter = require('./Router/admin-router');
const medicineRouter = require('./Router/medicine-router');
const otpRouter = require('./Router/otp-router');
const cartRouter = require('./Router/cart-router');
const orderRouter = require('./Router/order-router');
const userRouter = require('./Router/user-router');
const { verifyOrder } = require('./Router/order-controller');
const connectDB = require('./Utils/db');

// ✅ CORS Configuration
var corsOptions = {
    origin: [
        'http://localhost:3000', // For Phantom/Frontend testing
        'http://localhost:5000', // For Postman testing
        'http://localhost:5173', // For Postman testing
        'https://vitaledge-pi.vercel.app',
        'https://vitaledge-piyush-nayaks-projects.vercel.app',
        'https://vitaledge-git-main-piyush-nayaks-projects.vercel.app'
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

// ✅ Request logging middleware (for debugging)
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path}`);
    next();
});

// ✅ Public Routes (NO authentication required) - MUST be before other routes
app.get('/api/orders/verify/:orderId', verifyOrder);

// ✅ Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'vitaledge-backend'
    });
});

// ✅ Use Routes
app.use('/', router);
app.use('/admin', adminRouter);
app.use('/api', medicineRouter);
app.use('/api', cartRouter);
app.use('/api', orderRouter);
app.use('/api/users', userRouter);
app.use('/otp', otpRouter);

console.log('✅ All routes mounted:');
console.log('  - / (auth-router)');
console.log('  - /admin (admin-router)');
console.log('  - /api (medicine, cart, order routers)');
console.log('  - /api/users (user-router) ← ADDRESS ROUTES HERE');
console.log('  - /otp (otp-router)');

// ✅ Default route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// ✅ Connect to DB and start the server
connectDB().then(() => {
    const PORT = process.env.PORT || 7777;
    app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
    });
});
