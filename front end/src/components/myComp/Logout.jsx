// Logout.js
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // ✅ Updated to Firebase auth
import { logoutUser } from "../../firebase/auth"; // ✅ Firebase logout function
import { Navigate } from "react-router-dom";

const Logout = () => {
  const { user } = useAuth(); // ✅ Get Firebase user

  useEffect(() => {
    const handleLogout = async () => {
      const result = await logoutUser(); // ✅ Firebase logout
      if (result.success) {
        console.log("User logged out successfully");
      }
    };
    
    if (user) {
      handleLogout();
    }
  }, [user]);

  return <Navigate to="/login" />; // Redirect to login page after logout
};

export default Logout;
