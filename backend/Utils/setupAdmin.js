require('dotenv').config();
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'vitaledge-b9586',
      });
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error.message);
    process.exit(1);
  }
}

async function setInitialAdmin() {
  try {
    // Get email from command line argument or use default
    const email = process.argv[2];
    
    if (!email) {
      console.error('Usage: node setupAdmin.js <admin-email>');
      console.error('Example: node setupAdmin.js admin@example.com');
      process.exit(1);
    }

    // Find user by email
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
    } catch (error) {
      console.error(`❌ User not found with email: ${email}`);
      console.error('Please make sure the user has registered first.');
      process.exit(1);
    }

    // Set admin custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

    console.log(`✅ Successfully set admin privileges for:`);
    console.log(`   Email: ${userRecord.email}`);
    console.log(`   UID: ${userRecord.uid}`);
    console.log(`   Admin Status: Active`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting admin privileges:', error.message);
    process.exit(1);
  }
}

setInitialAdmin();
