// AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null); // Initially null until the user is fetched
  // const [services, setServices] = useState(null);

  const storeToken = (newToken) => {
    console.log("Storing token:", newToken); // Add this log

    setToken(newToken); // Update React state
    localStorage.setItem("token", newToken); // Update localStorage
  };

  const loggedIn = !!token; // Boolean value indicating if the user is logged in

  const LogoutUser = () => {
    setToken(null);
    setUser(null); // Also clear the user data
    localStorage.removeItem("token"); // Remove token from localStorage
  };

  const userAuthentication = async () => {
    if (!token) return; // Don't fetch user data if there's no token
    try {
      const response = await fetch("http://localhost:7777/auth", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.userData); // Update user data
      } else {
        console.log("Failed to fetch user data");
        LogoutUser(); // Clear user if the response fails
      }
    } catch (error) {
      console.error("Error authenticating user:", error);
      LogoutUser(); // Clear user data if error occurs
    }
  };

  // const getServices = async () => {
  //   try {
  //     const response = await fetch("http://localhost:3000/services", {
  //       method: "GET",
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       // console.log(data.msg);
  //       setServices(data.msg); // Update services
  //     } else {
  //       console.log("Failed to fetch services");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching services:", error); // Corrected message
  //     LogoutUser(); // Clear user data if error occurs
  //   }
  // };

  // useEffect(() => {
  //   getServices();
  // }, [token]); // Trigger the effect whenever the token changes

  useEffect(() => {
    userAuthentication();
  }, [token]); // Trigger the effect whenever the token changes

  return (
    <AuthContext.Provider value={{ storeToken, LogoutUser, loggedIn, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return auth;
};
