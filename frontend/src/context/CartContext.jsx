import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const lastFetchTimeRef = useRef(0);

  const fetchCartData = useCallback(async () => {
    if (!user) {
      setCartCount(0);
      setCartItems([]);
      return;
    }

    // Rate limiting: only fetch if last fetch was more than 2 seconds ago
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 2000) {
      console.log('🚫 Cart fetch throttled - too soon');
      return;
    }

    console.log('🛒 Fetching cart data for user:', user.email);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        const items = data.cart.items || [];
        setCartItems(items);
        // Count the number of different product types (not total quantity)
        setCartCount(items.length);
        lastFetchTimeRef.current = now;
        console.log('✅ Cart data fetched - count:', items.length);
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  }, [user]);

  // Fetch cart data when user changes
  useEffect(() => {
    fetchCartData();
  }, [user, fetchCartData]);

  const refreshCart = () => {
    fetchCartData();
  };

  const value = {
    cartCount,
    cartItems,
    refreshCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
