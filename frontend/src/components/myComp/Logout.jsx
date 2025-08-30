// Logout.js
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // ✅ Updated to Firebase auth
import { Navigate } from "react-router-dom";

const Logout = () => {
  const { user, logout } = useAuth(); // ✅ Get Firebase user and logout function

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout(); // ✅ Use logout from AuthContext
        console.log("User logged out successfully");
      } catch (error) {
        console.error("Logout error:", error);
      }
    };
    
    if (user) {
      handleLogout();
    }
  }, [user, logout]);

  return <Navigate to="/login" />; // Redirect to login page after logout
};

export default Logout;
