import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Section from './mycomp2/Section';
import Button from './mycomp2/Button';
import WalletConnectButton from './common/walletconnect';
import { FaWallet, FaShoppingBag, FaUser, FaCog, FaChartLine, FaCalendarAlt } from 'react-icons/fa';

const ProfileDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchOrders = async () => {
      try {
        const token = await user.getIdToken();
        const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
          
          // Calculate stats
          const totalOrders = data.orders.length;
          const totalSpent = data.orders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0);
          const pendingOrders = data.orders.filter(order => 
            ['pending', 'processing', 'confirmed'].includes(order.orderStatus)
          ).length;
          const completedOrders = data.orders.filter(order => 
            order.orderStatus === 'delivered'
          ).length;

          setStats({
            totalOrders,
            totalSpent,
            pendingOrders,
            completedOrders
          });
        } else {
          toast.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Error loading orders');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user, navigate]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'text-yellow-400';
      case 'confirmed': return 'text-blue-400';
      case 'processing': return 'text-orange-400';
      case 'shipped': return 'text-purple-400';
      case 'delivered': return 'text-green-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <Section className="pt-[6rem]">
        <div className="container">
          <div className="flex justify-center items-center h-64">
            <div className="text-n-1">Loading...</div>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section className="pt-[6rem]">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="h2 mb-4">Profile Dashboard</h1>
            <p className="text-n-4">Manage your account, orders, and wallet</p>
          </div>

          {/* User Info Card */}
          <div className="bg-n-8 border border-n-6 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-n-1 mb-1">
                  {user.displayName || 'User'}
                </h3>
                <p className="text-n-4">{user.email}</p>
                <p className="text-sm text-n-5">
                  Member since {new Date(user.metadata.creationTime).toLocaleDateString()}
                </p>
              </div>
              <Button
                onClick={() => navigate('/settings')}
                className="flex items-center space-x-2"
              >
                <FaCog />
                <span>Settings</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Stats and Wallet */}
            <div className="lg:col-span-1 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-n-8 border border-n-6 rounded-lg p-4 text-center">
                  <FaShoppingBag className="text-2xl text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-n-1">{stats.totalOrders}</div>
                  <div className="text-sm text-n-4">Total Orders</div>
                </div>
                <div className="bg-n-8 border border-n-6 rounded-lg p-4 text-center">
                  <FaChartLine className="text-2xl text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-n-1">${stats.totalSpent.toFixed(2)}</div>
                  <div className="text-sm text-n-4">Total Spent</div>
                </div>
                <div className="bg-n-8 border border-n-6 rounded-lg p-4 text-center">
                  <FaCalendarAlt className="text-2xl text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-n-1">{stats.pendingOrders}</div>
                  <div className="text-sm text-n-4">Pending</div>
                </div>
                <div className="bg-n-8 border border-n-6 rounded-lg p-4 text-center">
                  <FaShoppingBag className="text-2xl text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-n-1">{stats.completedOrders}</div>
                  <div className="text-sm text-n-4">Completed</div>
                </div>
              </div>

              {/* Wallet Connection */}
              <div className="bg-n-8 border border-n-6 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <FaWallet className="text-xl text-purple-400 mr-3" />
                  <h3 className="text-lg font-semibold text-n-1">Wallet Connection</h3>
                </div>
                <p className="text-n-4 text-sm mb-4">
                  Connect your wallet to enable blockchain features and secure payments
                </p>
                <WalletConnectButton />
              </div>

              {/* Quick Actions */}
              <div className="bg-n-8 border border-n-6 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-n-1 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/products')}
                    className="w-full justify-start"
                  >
                    Browse Products
                  </Button>
                  <Button
                    onClick={() => navigate('/cart')}
                    className="w-full justify-start"
                  >
                    View Cart
                  </Button>
                  <Button
                    onClick={() => navigate('/contact')}
                    className="w-full justify-start"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Orders */}
            <div className="lg:col-span-2">
              <div className="bg-n-8 border border-n-6 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-n-1">Recent Orders</h3>
                  <Button
                    onClick={() => navigate('/orders')}
                    className="text-sm"
                  >
                    View All Orders
                  </Button>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <FaShoppingBag className="text-4xl text-n-4 mx-auto mb-4" />
                    <p className="text-n-4">No orders yet</p>
                    <Button
                      onClick={() => navigate('/products')}
                      className="mt-4"
                    >
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order._id}
                        className="border border-n-6 rounded-lg p-4 hover:border-n-5 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-n-1">
                            Order #{order.orderId}
                          </div>
                          <div className={`text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus?.toUpperCase()}
                          </div>
                        </div>
                        
                        <div className="text-sm text-n-4 mb-2">
                          {new Date(order.createdAt).toLocaleDateString()} • 
                          {order.medicines?.length || 0} items • 
                          ${order.pricing?.total?.toFixed(2) || '0.00'}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-n-5">
                            {order.medicines?.slice(0, 2).map(item => item.name).join(', ')}
                            {order.medicines?.length > 2 && ` +${order.medicines.length - 2} more`}
                          </div>
                          <Button
                            onClick={() => navigate(`/orders/${order.orderId}`)}
                            className="text-xs px-3 py-1"
                          >
                            View Details
                          </Button>
                        </div>

                        {order.blockchain && (
                          <div className="mt-2 text-xs text-green-400 flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                            Blockchain Verified
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ProfileDashboard;
