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

### Contact
- `POST /api/contact` - Submit contact form

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

## 🐛 Troubleshooting

### Common Issues

#### Phantom Wallet Connection Error
**Problem:** "Unexpected error" when connecting Phantom wallet

**Solutions:**
1. **Unlock your Phantom wallet** - Make sure Phantom is unlocked before connecting
2. **Clear previous connection** - If Phantom was previously connected, the app will automatically disconnect and reconnect
3. **Refresh the page** - Sometimes Phantom needs a fresh page load
4. **Check Phantom network** - Ensure Phantom is on the correct network (Devnet for development)
5. **Browser console** - Check for specific error messages in browser developer tools (F12)

**Technical Details:**
The app now includes:
- Automatic disconnect/reconnect handling
- Real-time wallet connection updates (no page refresh needed)
- Event listeners for account changes and disconnections
- Better error messages for common issues

#### Solana Transaction "Already Processed" Error
**Problem:** "This transaction has already been processed" when making payment

**Root Cause:** Solana detects duplicate transactions within ~2 minutes. Even with different blockhashes, if sender, receiver, and amount are identical, Solana may reject it as a duplicate.

**Solutions:**
1. **Wait for the first transaction to complete** - Don't click "Place Order" multiple times
2. **Check your order history** - The first transaction may have succeeded
3. **Unique memo added** - Each transaction now includes a unique memo to prevent duplicates
4. **Fresh blockhash** - The app fetches a fresh blockhash for each transaction
5. **Button is disabled during processing** - The payment button automatically disables while processing

**Technical Details:**
The app now includes:
- **Memo Program Integration** - Each transaction includes a unique memo: `VitalEdge Order: VE_[timestamp]_[random]`
- Fresh blockhash fetching for each transaction (prevents reuse)
- Duplicate submission prevention (checks `processing` state)
- Unique transaction ID generation for tracking
- Better error handling for "already processed" errors
- Warning toast if duplicate transaction detected
- Transaction details logging for debugging

**How the Memo Works:**
```javascript
// Each transaction gets a unique identifier
Memo: "VitalEdge Order: VE_1730304123456_abc123xyz"

// This makes every transaction unique, even with:
// - Same sender wallet
// - Same receiver wallet  
// - Same amount (₹708 → 0.041652 SOL)
```

**What to do if you see this error:**
1. Check your order history - the payment may have succeeded
2. Wait 30 seconds before retrying
3. Refresh the page if the button stays disabled
4. Check Solana devnet explorer to verify transaction status
5. Look for the memo in the transaction details to identify your order

#### Wallet Connection Not Updating
**Problem:** Payment button doesn't enable after connecting wallet

**Solution:** This has been fixed! The app now updates in real-time when you connect/disconnect wallets. No page refresh needed.

#### MetaMask vs Phantom Selection
**Problem:** Wrong wallet opens when clicking "Connect Wallet"

**Solution:** 
- If both wallets are installed, a selection modal will appear
- If only one wallet is installed, it connects directly
- The app auto-detects which wallets you have installed

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
