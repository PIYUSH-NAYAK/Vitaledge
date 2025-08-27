// Firebase Authentication Service
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut, 
  onAuthStateChanged,
  updateProfile,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  EmailAuthProvider,
  AuthErrorCodes
} from "firebase/auth";
import { auth } from "./config";

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Register new user with email/password
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile with display name
    if (displayName) {
      await updateProfile(user, {
        displayName: displayName
      });
    }
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || displayName
      }
    };
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle specific Firebase auth errors
    if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
      // Check what sign-in methods are available for this email
      try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.includes('google.com')) {
          return {
            success: false,
            error: "This email is already registered with Google. Please sign in with Google or use a different email address.",
            errorCode: "email-exists-google"
          };
        } else {
          return {
            success: false,
            error: "An account with this email already exists. Please try logging in instead.",
            errorCode: "email-exists"
          };
        }
      } catch (methodsError) {
        return {
          success: false,
          error: "An account with this email already exists. Please try logging in instead.",
          errorCode: "email-exists"
        };
      }
    }
    
    return {
      success: false,
      error: error.message,
      errorCode: error.code
    };
  }
};

// Login user with email/password
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const isNewUser = result.additionalUserInfo?.isNewUser || false;
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      },
      isNewUser: isNewUser
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Check what sign-in methods are available for an email
export const checkSignInMethods = async (email) => {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return {
      success: true,
      methods: methods
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Link email/password to existing Google account
export const linkEmailPassword = async (email, password) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is currently signed in");
    }
    
    const credential = EmailAuthProvider.credential(email, password);
    const result = await linkWithCredential(user, credential);
    
    return {
      success: true,
      user: {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Enhanced Google sign-in with account linking for existing email/password users
export const signInWithGoogleAndLink = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const isNewUser = result.additionalUserInfo?.isNewUser || false;
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      },
      isNewUser: isNewUser,
      linked: false
    };
  } catch (error) {
    // Handle account exists with different credential error
    if (error.code === 'auth/account-exists-with-different-credential') {
      const email = error.customData.email;
      
      // Get sign-in methods for this email
      try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        
        if (methods.includes('password')) {
          // Email/password account exists - we can link automatically
          return {
            success: false,
            error: 'account-exists-email-password',
            email: email,
            message: 'An account with this email already exists. We can link your Google account to it.',
            canAutoLink: true
          };
        }
      } catch (methodsError) {
        console.error('Error checking sign-in methods:', methodsError);
      }
    }
    
    return {
      success: false,
      error: error.message,
      errorCode: error.code
    };
  }
};

// Get Firebase ID token for API calls
export const getIdToken = async () => {
  const user = getCurrentUser();
  if (user) {
    try {
      const token = await user.getIdToken();
      return token;
    } catch (error) {
      console.error("Error getting ID token:", error);
      return null;
    }
  }
  return null;
};
