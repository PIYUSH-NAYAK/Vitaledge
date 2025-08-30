import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChange } from '../firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
  const [newGoogleUser, setNewGoogleUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const triggerPasswordSetup = (userInfo) => {
    setNewGoogleUser(userInfo);
    setShowPasswordSetup(true);
  };

  const closePasswordSetup = () => {
    setShowPasswordSetup(false);
    setNewGoogleUser(null);
  };

  const value = {
    user,
    loading,
    showPasswordSetup,
    newGoogleUser,
    triggerPasswordSetup,
    closePasswordSetup
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
