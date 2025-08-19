# VitalEdge - Medical Platform

A comprehensive healthcare platform built with React, Node.js, Firebase, and blockchain technology for secure medicine distribution and patient management.

## 🏥 About VitalEdge

VitalEdge is a modern medical platform that revolutionizes healthcare delivery by combining:
- **Secure Medicine Distribution** via blockchain technology
- **Patient Management System** with Firebase authentication
- **Online Consultations** and prescription tracking
- **Wallet Integration** for secure payments (MetaMask/Phantom)
- **Responsive Design** optimized for all devices

## 🚀 Features

- ✅ **User Authentication** - Firebase-based secure login/registration
- ✅ **Product Catalog** - Browse and purchase medical products
- ✅ **Shopping Cart** - Full e-commerce functionality
- ✅ **Wallet Integration** - MetaMask and Phantom wallet support
- ✅ **Payment Processing** - Solana blockchain payments
- ✅ **Admin Dashboard** - Manage products and users
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Real-time Notifications** - Toast notifications for user feedback

## 🛠️ Tech Stack

### Frontend
- **React** 18+ with Vite
- **Tailwind CSS** for styling
- **Firebase** for authentication
- **React Router** for navigation
- **React Toastify** for notifications
- **Solana Web3.js** for blockchain integration

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Firebase Admin SDK** for authentication
- **Solana Web3.js** for blockchain operations
- **CORS** for cross-origin requests

### Blockchain
- **Solana** blockchain network
- **Rust** smart contracts
- **Anchor Framework** for development

## 📦 Installation & Setup

### Prerequisites
- **Node.js** 16+ and npm
- **MongoDB** (local or Atlas)
- **Git**
- **Firebase Account**
- **Solana CLI** (for blockchain development)

### 1. Clone Repository
```bash
git clone https://github.com/PIYUSH-NAYAK/Vitaledge.git
cd Vitaledge
```

### 2. Frontend Setup
```bash
cd "front end"
npm install

# Create environment file
cp .env.example .env

# Configure your Firebase credentials in .env (copy from .env.example)
# Update with your actual Firebase project details:
# VITE_FIREBASE_API_KEY=AIzaSyExample123456789abcdefghijklmnop
# VITE_FIREBASE_AUTH_DOMAIN=your-project-12345.firebaseapp.com
# VITE_FIREBASE_PROJECT_ID=your-project-12345
# etc...

# Start development server
npm run dev
```

### 3. Backend Setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env

# Configure your credentials in .env (copy from .env.example)
# Update with your actual credentials:
# PORT=7777
# MONGODB_URI=mongodb://localhost:27017/vitaledge (or your MongoDB Atlas URI)
# FIREBASE_PROJECT_ID=your-project-12345
# FIREBASE_CLIENT_EMAIL=firebase-adminsdk-12abc@your-project-12345.iam.gserviceaccount.com
# FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
# SOLANA_WALLET_PATH=/home/user/solana-wallet/keypair.json

# Start backend server
npm start
```

### 4. Database Setup
```bash
# For local MongoDB
mongosh
use vitaledge

# For MongoDB Atlas
# Update MONGODB_URI in backend/.env with your Atlas connection string
```

### 5. Firebase Configuration

#### Frontend Firebase Setup:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable Authentication → Sign-in method → Email/Password
4. Get your config from Project Settings → General → Your apps → Web app
5. Copy all the config values to `front end/.env`:
   ```
   VITE_FIREBASE_API_KEY=AIzaSy... (from config.apiKey)
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com (from config.authDomain)
   VITE_FIREBASE_PROJECT_ID=your-project-id (from config.projectId)
   # ... copy all values from the Firebase config object
   ```

#### Backend Firebase Setup:
1. Go to Project Settings → Service accounts → Generate new private key
2. Download the JSON file (contains service account credentials)
3. Extract values and add to `backend/.env`:
   ```
   FIREBASE_PROJECT_ID=your-project-id (from JSON: project_id)
   FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@project.iam.gserviceaccount.com" (from JSON: client_email)
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n" (from JSON: private_key)
   ```
   **Important**: Ensure the private_key includes `\n` for newlines

### 6. Solana Wallet Setup (Optional)
```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.4/install)"

# Generate keypair
solana-keygen new --outfile ~/solana-wallet/keypair.json

# Update SOLANA_WALLET_PATH in backend/.env
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd "front end"
npm run dev
```

### Production Build
```bash
# Frontend
cd "front end"
npm run build

# Backend (PM2 recommended)
cd backend
npm install -g pm2
pm2 start server.js --name "vitaledge-backend"
```

## 📱 Application URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:7777
- **API Documentation**: http://localhost:7777/api-docs (if available)

## 🔐 Environment Variables

### Frontend (.env)
```env
# Copy from front end/.env.example and update with your Firebase project details
VITE_FIREBASE_API_KEY=AIzaSyExample123456789abcdefghijklmnop
VITE_FIREBASE_AUTH_DOMAIN=your-project-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-12345
VITE_FIREBASE_STORAGE_BUCKET=your-project-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-ABCD123456
VITE_APP_BACKEND_URL=http://localhost:7777
```

### Backend (.env)
```env
# Copy from backend/.env.example and update with your actual credentials
PORT=7777
MONGODB_URI=mongodb://localhost:27017/vitaledge
FIREBASE_PROJECT_ID=your-project-12345
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-12abc@your-project-12345.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Actual_Private_Key_Here\n-----END PRIVATE KEY-----\n"
SOLANA_WALLET_PATH=/home/user/solana-wallet/keypair.json
FRONTEND_URL=http://localhost:5173
```

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm start` - Start production server
- `npm run dev` - Start with nodemon (development)
- `npm test` - Run tests (if configured)

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order

## 🔒 Security Features

- **Firebase Authentication** - Secure user management
- **JWT Tokens** - API route protection
- **CORS Configuration** - Cross-origin security
- **Environment Variables** - Secure credential storage
- **Blockchain Integration** - Transparent transactions
- **Input Validation** - Data sanitization

<!-- ## 🚀 Deployment -->

<!-- ### Frontend (Vercel)
```bash
npm install -g vercel
cd "front end"
vercel --prod
```

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables in platform dashboard
4. Deploy -->

### Environment Variables for Production
Update all localhost URLs to production URLs in environment files.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

<!-- ## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. -->

<!-- ## 👥 Team

- **PIYUSH NAYAK** - Project Lead & Full Stack Developer -->

## 📞 Support

For support and questions:
- Email: support@vitaledge.com
- GitHub Issues: [Create Issue](https://github.com/PIYUSH-NAYAK/Vitaledge/issues)



---

**VitalEdge** - Revolutionizing Healthcare Through Technology 🏥💊
