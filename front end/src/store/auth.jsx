// AuthContext.js
import { createContext, useContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [services, setServices] = useState(null);

  const storeToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const loggedIn = Boolean(token);

  const LogoutUser = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  }, []);

  const userAuthentication = useCallback(async () => {
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/user", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.userData);
      } else {
        LogoutUser();
      }
    } catch (error) {
      console.error("Error authenticating user:", error);
      LogoutUser();
    }
  }, [token, LogoutUser]);

  const getServices = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/services", { method: "GET" });
      if (response.ok) {
        const data = await response.json();
        setServices(data.msg);
      } else {
        console.log("Failed to fetch services");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }, []);

  useEffect(() => {
    userAuthentication();
    getServices();
  }, [token, userAuthentication, getServices]);

  return (
    <AuthContext.Provider value={{ storeToken, LogoutUser, loggedIn, user, services }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
