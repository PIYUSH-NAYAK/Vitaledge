const admin = require('firebase-admin');

// Set custom claims for a user
const setCustomClaim = async (req, res) => {
  try {
    const { email, customClaims } = req.body;
    const currentUser = req.firebaseUser;

    // Check if the current user has admin privileges
    const currentUserRecord = await admin.auth().getUser(currentUser.uid);
    const currentUserClaims = currentUserRecord.customClaims || {};
    
    if (!currentUserClaims.admin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      });
    }

    if (!email || !customClaims) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and customClaims are required' 
      });
    }

    // Find user by email
    let targetUser;
    try {
      targetUser = await admin.auth().getUserByEmail(email);
    } catch (error) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found with the provided email' 
      });
    }

    // Set custom claims
    await admin.auth().setCustomUserClaims(targetUser.uid, customClaims);

    res.status(200).json({ 
      success: true, 
      message: `Custom claims set successfully for ${email}`,
      uid: targetUser.uid,
      claims: customClaims
    });

  } catch (error) {
    console.error('Error setting custom claims:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error', 
      error: error.message 
    });
  }
};

// Get user's custom claims
const getUserClaims = async (req, res) => {
  try {
    const { email } = req.params;
    const currentUser = req.firebaseUser;

    // Check if the current user has admin privileges
    const currentUserRecord = await admin.auth().getUser(currentUser.uid);
    const currentUserClaims = currentUserRecord.customClaims || {};
    
    if (!currentUserClaims.admin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      });
    }

    // Find user by email
    let targetUser;
    try {
      targetUser = await admin.auth().getUserByEmail(email);
    } catch (error) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found with the provided email' 
      });
    }

    const claims = targetUser.customClaims || {};

    res.status(200).json({ 
      success: true, 
      uid: targetUser.uid,
      email: targetUser.email,
      claims: claims
    });

  } catch (error) {
    console.error('Error getting user claims:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error', 
      error: error.message 
    });
  }
};

// List all users (admin only)
const listUsers = async (req, res) => {
  try {
    const currentUser = req.firebaseUser;

    // Check if the current user has admin privileges
    const currentUserRecord = await admin.auth().getUser(currentUser.uid);
    const currentUserClaims = currentUserRecord.customClaims || {};
    
    if (!currentUserClaims.admin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      });
    }

    const listUsersResult = await admin.auth().listUsers(1000); // Limit to 1000 users
    
    const users = listUsersResult.users.map(userRecord => ({
      uid: userRecord.uid,
      email: userRecord.email,
      emailVerified: userRecord.emailVerified,
      disabled: userRecord.disabled,
      customClaims: userRecord.customClaims || {},
      creationTime: userRecord.metadata.creationTime,
      lastSignInTime: userRecord.metadata.lastSignInTime
    }));

    res.status(200).json({ 
      success: true, 
      users: users,
      totalUsers: users.length
    });

  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error', 
      error: error.message 
    });
  }
};

module.exports = {
  setCustomClaim,
  getUserClaims,
  listUsers
};
