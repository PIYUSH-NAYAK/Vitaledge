const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// For development, we'll use a simpler configuration
if (!admin.apps.length) {
  try {
    // Try to initialize with service account if available
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      // Fallback: Initialize with just project ID for token verification
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'vitaledge-b9586',
      });
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error.message);
    // Initialize with minimal config for development
    admin.initializeApp({
      projectId: 'vitaledge-b9586',
    });
  }
}

// Simple token cache to reduce Firebase API calls
const tokenCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Middleware to verify Firebase ID tokens
const firebaseAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    const cached = tokenCache.get(token);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      req.firebaseUser = cached.user;
      return next();
    }
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    const user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email,
      customClaims: decodedToken
    };
    
    req.firebaseUser = user;
    
    // Cache the result
    tokenCache.set(token, { user, timestamp: Date.now() });
    
    // Clean up old cache entries periodically
    if (tokenCache.size > 100) {
      const now = Date.now();
      for (const [key, value] of tokenCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
          tokenCache.delete(key);
        }
      }
    }
    
    next();
  } catch (error) {
    console.error('❌ Firebase token verification error:', error.message);
    res.status(401).json({ error: 'Invalid or expired token', details: error.message });
  }
};

module.exports = firebaseAuthMiddleware;
