// Logout.js
import { useEffect } from "react";
import { useAuth } from "../store/auth";
import { Navigate } from "react-router-dom";

const Logout = () => {
  const { LogoutUser } = useAuth();

  useEffect(() => {
    LogoutUser(); // Clear user data and token
  }, [LogoutUser]); // Ensure the logout process is triggered

  return <Navigate to="/login" />; // Redirect to login page after logout
};

export default Logout;
