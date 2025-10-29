import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import Section from './mycomp2/Section';
import Button from './mycomp2/Button';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [pagination, setPagination] = useState({});
  const [cancellingOrders, setCancellingOrders] = useState(new Set());
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancellingOrders(prev => new Set(prev).add(orderId));
    try {
      const token = await user.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/orders/${orderId}/cancel`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        setOrders(prev => prev.map(order => 
          order.orderId === orderId 
            ? { ...order, orderStatus: 'cancelled' }
            : order
        ));
        toast.success('Order cancelled successfully');
      } else {
        console.error('❌ Cancel request failed:', response.status, response.statusText);
        const errorData = await response.json();
        console.error('❌ Error details:', errorData);
        toast.error(errorData.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Error cancelling order');
    } finally {
      setCancellingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  // Fetch orders
  const fetchOrders = useCallback(async (page = 1, status = 'all') => {
    try {
      const token = await user.getIdToken();
      // eslint-disable-next-line no-undef
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      
      if (status !== 'all') {
        queryParams.append('status', status);
      }

      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/orders?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
        setPagination(data.pagination);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error loading orders');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchOrders(1, filter);
    }
  }, [user, filter, fetchOrders]);

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-600',
      confirmed: 'bg-blue-600',
      processing: 'bg-purple-600',
      shipped: 'bg-indigo-600',
      out_for_delivery: 'bg-orange-600',
      delivered: 'bg-green-600',
      cancelled: 'bg-red-600'
    };
    return colors[status] || 'bg-gray-600';
  };

  // Format status text
  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <Section className="pt-[6rem] -mt-[5.25rem]" crosses>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Loading orders...</div>
        </div>
      </Section>
    );
  }

  return (
    <Section className="pt-[6rem] -mt-[5.25rem]" crosses>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Order History</h1>
              <p className="text-n-4">Track your medicine orders and view past purchases</p>
            </div>
            <Button
              onClick={() => navigate('/medicines')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Continue Shopping
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 mb-8 bg-n-8 border border-n-6 rounded-lg p-1">
            {[
              { key: 'all', label: 'All Orders' },
              { key: 'pending', label: 'Pending' },
              { key: 'confirmed', label: 'Confirmed' },
              { key: 'shipped', label: 'Shipped' },
              { key: 'delivered', label: 'Delivered' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'text-n-4 hover:text-white hover:bg-n-7'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-semibold text-white mb-4">No orders found</h2>
              <p className="text-n-4 mb-8">
                {filter === 'all' 
                  ? "You haven't placed any orders yet" 
                  : `No ${filter} orders found`}
              </p>
              <Button
                onClick={() => navigate('/medicines')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.orderId} className="bg-n-8 border border-n-6 rounded-lg p-6">
                  
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Order #{order.orderId}
                      </h3>
                      <p className="text-n-4 text-sm">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusBadgeColor(order.orderStatus)}`}>
                        {formatStatus(order.orderStatus)}
                      </div>
                      <div className="text-white font-semibold mt-1">
                        ₹{order.pricing.total.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {order.medicines.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <img
                          src={item.medicineId?.images?.primary?.url || '/placeholder-medicine.svg'}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <div className="text-white text-sm font-medium">{item.name}</div>
                          <div className="text-n-4 text-xs">Qty: {item.quantity}</div>
                        </div>
                      </div>
                    ))}
                    {order.medicines.length > 3 && (
                      <div className="flex items-center justify-center text-n-4 text-sm">
                        +{order.medicines.length - 3} more items
                      </div>
                    )}
                  </div>

                  {/* Order Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-n-6">
                    <div className="flex space-x-4">
                      <Link
                        to={`/orders/${order.orderId}`}
                        className="text-blue-500 hover:text-blue-400 text-sm font-medium"
                      >
                        View Details & Track
                      </Link>
                      {order.paymentDetails?.transactionHash && (
                        <a
                          href={(() => {
                            const txHash = order.paymentDetails.transactionHash;
                            const network = order.paymentDetails.blockchainNetwork;
                            if (network?.includes('solana')) {
                              return `https://explorer.solana.com/tx/${txHash}?cluster=devnet`;
                            } else if (network?.includes('ethereum')) {
                              return `https://sepolia.etherscan.io/tx/${txHash}`;
                            }
                            return '#';
                          })()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-500 hover:text-purple-400 text-sm font-medium"
                        >
                          🔗 Receipt
                        </a>
                      )}
                      {order.orderStatus === 'delivered' && (
                        <button className="text-orange-500 hover:text-orange-400 text-sm font-medium">
                          Reorder
                        </button>
                      )}
                    </div>
                    
                    {['pending', 'confirmed'].includes(order.orderStatus) && (
                      <button 
                        onClick={() => handleCancelOrder(order.orderId)}
                        disabled={cancellingOrders.has(order.orderId)}
                        className="text-red-500 hover:text-red-400 disabled:text-red-300 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        {cancellingOrders.has(order.orderId) ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                  </div>

                  {/* Delivery Info */}
                  {order.tracking?.estimatedDelivery && (
                    <div className="mt-4 p-3 bg-n-7 border border-n-6 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-n-4">Estimated Delivery:</span>
                        <span className="text-white font-medium">
                          {new Date(order.tracking.estimatedDelivery).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      {order.tracking.currentLocation?.city && (
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-n-4">Current Location:</span>
                          <span className="text-white">{order.tracking.currentLocation.city}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <Button
                    onClick={() => fetchOrders(pagination.currentPage - 1, filter)}
                    disabled={pagination.currentPage <= 1}
                    className="px-4 py-2 bg-n-7 border border-n-6 text-white rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  <span className="text-n-4">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    onClick={() => fetchOrders(pagination.currentPage + 1, filter)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                    className="px-4 py-2 bg-n-7 border border-n-6 text-white rounded-lg disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default OrderHistory;
