import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Section from './mycomp2/Section';
import Button from './mycomp2/Button';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], estimatedTotal: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  // Fetch cart data
  const fetchCart = useCallback(async () => {
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
        setCart(data.cart);
      } else {
        toast.error('Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Error loading cart');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Update item quantity
  const updateQuantity = async (medicineId, quantity) => {
    if (quantity < 1) return;
    
    setUpdating(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/cart/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ medicineId, quantity })
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
        // No toast for cart updates - silent success
        // Refresh cart count in header
        refreshCart();
      } else {
        // Show error toast so user knows what went wrong
        toast.error('Failed to update cart');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Error updating cart');
    } finally {
      setUpdating(false);
    }
  };

  // Remove item from cart
  const removeItem = async (medicineId) => {
    setUpdating(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/cart/remove/${medicineId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
        // No toast for item removal - silent success
        // Refresh cart count in header
        refreshCart();
      } else {
        // Show error toast so user knows what went wrong
        toast.error('Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Error removing item');
    } finally {
      setUpdating(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    
    setUpdating(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
        // No toast for cart clear - silent success
        // Refresh cart count in header
        refreshCart();
      } else {
        // Show error toast so user knows what went wrong
        toast.error('Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Error clearing cart');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  if (loading) {
    return (
      <Section className="pt-[6rem] -mt-[5.25rem]" crosses>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Loading cart...</div>
        </div>
      </Section>
    );
  }

  return (
    <Section className="pt-[6rem] -mt-[5.25rem]" crosses>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
            {cart.items.length > 0 && (
              <Button
                onClick={clearCart}
                disabled={updating}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Clear Cart
              </Button>
            )}
          </div>

          {cart.items.length === 0 ? (
            /* Empty Cart State */
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-semibold text-white mb-4">Your cart is empty</h2>
              <p className="text-n-4 mb-8">Add some medicines to get started</p>
              <Button
                onClick={() => navigate('/medicines')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
              >
                Browse Medicines
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => (
                  <div key={item.medicineId._id} className="bg-n-8 border border-n-6 rounded-lg p-6">
                    <div className="flex items-center space-x-4">
                      
                      {/* Medicine Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.medicineId.images?.primary?.url || '/placeholder-medicine.svg'}
                          alt={item.medicineId.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>

                      {/* Medicine Details */}
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {item.medicineId.name}
                        </h3>
                        <p className="text-n-4 text-sm mb-2">
                          Category: {item.medicineId.category}
                        </p>
                        <div className="flex items-center space-x-4">
                          <span className="text-green-500 font-semibold">
                            ₹{item.medicineId.price.discountedPrice}
                          </span>
                          <span className="text-n-4">
                            Stock: {item.medicineId.stock.quantity} {item.medicineId.stock.unit}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.medicineId._id, item.quantity - 1)}
                          disabled={updating || item.quantity <= 1}
                          className="w-8 h-8 bg-n-7 border border-n-6 rounded-md flex items-center justify-center text-white hover:bg-n-6 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="text-white font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.medicineId._id, item.quantity + 1)}
                          disabled={updating || item.quantity >= item.medicineId.stock.quantity}
                          className="w-8 h-8 bg-n-7 border border-n-6 rounded-md flex items-center justify-center text-white hover:bg-n-6 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <div className="text-white font-semibold">
                          ₹{(item.quantity * item.medicineId.price.discountedPrice).toFixed(2)}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.medicineId._id)}
                        disabled={updating}
                        className="text-red-500 hover:text-red-400 p-2"
                      >
                        🗑️
                      </button>
                    </div>

                    {/* Prescription Warning */}
                    {item.medicineId.prescriptionRequired && (
                      <div className="mt-4 bg-yellow-900 border border-yellow-700 rounded-lg p-3">
                        <p className="text-yellow-300 text-sm">
                          📋 This medicine requires a valid prescription
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-n-8 border border-n-6 rounded-lg p-6 sticky top-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Order Summary</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-n-4">Items ({cart.totalItems})</span>
                      <span className="text-white">₹{cart.estimatedTotal?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-n-4">Delivery</span>
                      <span className="text-white">
                        {cart.estimatedTotal > 500 ? 'FREE' : '₹50.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-n-4">GST (18%)</span>
                      <span className="text-white">₹{(cart.estimatedTotal * 0.18)?.toFixed(2) || '0.00'}</span>
                    </div>
                    <hr className="border-n-6" />
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-white">Total</span>
                      <span className="text-green-500">
                        ₹{(cart.estimatedTotal + (cart.estimatedTotal * 0.18) + (cart.estimatedTotal > 500 ? 0 : 50))?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate('/checkout')}
                    disabled={updating || cart.items.length === 0}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
                  >
                    Proceed to Checkout
                  </Button>

                  {cart.estimatedTotal <= 500 && (
                    <p className="text-n-4 text-sm mt-3 text-center">
                      Add ₹{(500 - cart.estimatedTotal).toFixed(2)} more for free delivery
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default Cart;
