import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Section from './mycomp2/Section';
import Button from './mycomp2/Button';
import { FaSearch, FaFilter, FaSort, FaChartLine, FaBoxes, FaRupeeSign, FaUsers, FaClock } from 'react-icons/fa';

const AdminOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [transferOwner, setTransferOwner] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    averageOrderValue: 0
  });
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, sortBy, sortOrder, currentPage]);

  const fetchStats = async () => {
    try {
      const token = await user.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/admin/orders?limit=1000`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        const allOrders = data.orders || [];
        
        const totalRevenue = allOrders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0);
        const pendingOrders = allOrders.filter(o => ['pending', 'confirmed', 'processing'].includes(o.orderStatus)).length;
        const deliveredOrders = allOrders.filter(o => o.orderStatus === 'delivered').length;
        
        setStats({
          totalOrders: allOrders.length,
          totalRevenue,
          pendingOrders,
          deliveredOrders,
          averageOrderValue: allOrders.length > 0 ? totalRevenue / allOrders.length : 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = await user.getIdToken();
      const url = new URL(`${import.meta.env.VITE_APP_BACKEND_URL}/admin/orders`);
      
      if (statusFilter) url.searchParams.append('status', statusFilter);
      if (searchQuery) url.searchParams.append('q', searchQuery);
      url.searchParams.append('page', currentPage);
      url.searchParams.append('limit', '20');
      
      // Apply date range filter
      if (dateRange.start) url.searchParams.append('startDate', dateRange.start);
      if (dateRange.end) url.searchParams.append('endDate', dateRange.end);

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        let fetchedOrders = data.orders || [];
        
        // Client-side sorting
        fetchedOrders = fetchedOrders.sort((a, b) => {
          let aVal, bVal;
          
          switch (sortBy) {
            case 'total':
              aVal = a.pricing?.total || 0;
              bVal = b.pricing?.total || 0;
              break;
            case 'createdAt':
              aVal = new Date(a.createdAt).getTime();
              bVal = new Date(b.createdAt).getTime();
              break;
            case 'status':
              aVal = a.orderStatus;
              bVal = b.orderStatus;
              break;
            default:
              aVal = new Date(a.createdAt).getTime();
              bVal = new Date(b.createdAt).getTime();
          }
          
          if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
        
        setOrders(fetchedOrders);
        
        if (data.pagination) {
          setTotalPages(Math.ceil(data.pagination.total / 20));
        }
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

  const handleSearch = () => {
    setCurrentPage(1);
    fetchOrders();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const exportToCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Status', 'Items', 'Total', 'Payment Method'];
    const csvData = orders.map(order => [
      order.orderId,
      new Date(order.createdAt).toLocaleString(),
      order.userEmail,
      order.orderStatus,
      order.medicines?.length || 0,
      order.pricing?.total?.toFixed(2) || '0.00',
      order.paymentDetails?.method || 'N/A'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Orders exported to CSV');
  };

  const handleStatusUpdate = async (orderId) => {
    if (!statusUpdate) {
      toast.error('Please select a status');
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: statusUpdate, note: 'Updated by admin' })
      });

      if (response.ok) {
        toast.success('Order status updated');
        fetchOrders();
        setSelectedOrder(null);
        setStatusUpdate('');
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status');
    }
  };

  const handleTransferOwnership = async (orderId) => {
    if (!transferOwner || transferOwner.trim().length < 32) {
      toast.error('Please enter a valid Solana public key (44 characters)');
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/admin/orders/${orderId}/transfer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newOwner: transferOwner.trim() })
      });

      if (response.ok) {
        toast.success('Ownership transferred on-chain');
        fetchOrders();
        setSelectedOrder(null);
        setTransferOwner('');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to transfer ownership');
      }
    } catch (error) {
      console.error('Error transferring ownership:', error);
      toast.error('Error transferring ownership');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-blue-500',
      processing: 'bg-purple-500',
      shipped: 'bg-indigo-500',
      out_for_delivery: 'bg-orange-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <Section className="pt-[6rem] -mt-[5.25rem]" crosses>
        <div className="container">
          <div className="text-white text-center">Loading orders...</div>
        </div>
      </Section>
    );
  }

  return (
    <Section className="pt-[6rem] -mt-[5.25rem]" crosses>
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Admin - Order Management</h1>
          <Button onClick={exportToCSV} className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </Button>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <FaBoxes className="text-blue-400 text-2xl" />
              <span className="text-blue-400 text-sm">Total</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.totalOrders}</div>
            <div className="text-n-4 text-sm">Orders</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <FaRupeeSign className="text-green-400 text-2xl" />
              <span className="text-green-400 text-sm">Revenue</span>
            </div>
            <div className="text-3xl font-bold text-white">₹{stats.totalRevenue.toFixed(0)}</div>
            <div className="text-n-4 text-sm">Total Revenue</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <FaClock className="text-yellow-400 text-2xl" />
              <span className="text-yellow-400 text-sm">Pending</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.pendingOrders}</div>
            <div className="text-n-4 text-sm">Active Orders</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <FaChartLine className="text-purple-400 text-2xl" />
              <span className="text-purple-400 text-sm">Delivered</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.deliveredOrders}</div>
            <div className="text-n-4 text-sm">Completed</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <FaUsers className="text-orange-400 text-2xl" />
              <span className="text-orange-400 text-sm">Average</span>
            </div>
            <div className="text-3xl font-bold text-white">₹{stats.averageOrderValue.toFixed(0)}</div>
            <div className="text-n-4 text-sm">Order Value</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-n-8 border border-n-6 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <FaFilter className="text-blue-400" />
              Filters & Search
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              {showFilters ? 'Hide Filters' : 'Show More Filters'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4" />
              <input
                type="text"
                placeholder="Search by Order ID or Email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 bg-n-7 border border-n-6 rounded text-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-n-7 border border-n-6 rounded px-4 py-2 text-white"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <Button onClick={handleSearch} className="w-full">
              Search
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-n-6">
              <div>
                <label className="block text-n-4 text-sm mb-2">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full bg-n-7 border border-n-6 rounded px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-n-4 text-sm mb-2">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full bg-n-7 border border-n-6 rounded px-4 py-2 text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sorting Controls */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-n-4 flex items-center gap-2">
            <FaSort />
            Sort by:
          </span>
          <button
            onClick={() => handleSort('createdAt')}
            className={`px-4 py-2 rounded ${sortBy === 'createdAt' ? 'bg-blue-600 text-white' : 'bg-n-7 text-n-4'}`}
          >
            Date {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('total')}
            className={`px-4 py-2 rounded ${sortBy === 'total' ? 'bg-blue-600 text-white' : 'bg-n-7 text-n-4'}`}
          >
            Total {sortBy === 'total' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('status')}
            className={`px-4 py-2 rounded ${sortBy === 'status' ? 'bg-blue-600 text-white' : 'bg-n-7 text-n-4'}`}
          >
            Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>

        {/* Order Count */}
        <div className="mb-4 text-n-4">
          Showing {orders.length} orders
          {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-n-8 border border-n-6 rounded-lg p-6 text-center text-n-4">
              No orders found
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="bg-n-8 border border-n-6 rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{order.orderId}</h3>
                    <p className="text-n-4 text-sm">{order.userEmail}</p>
                    <p className="text-n-4 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col gap-2 mt-4 md:mt-0">
                    <span className={`${getStatusColor(order.orderStatus)} text-white px-3 py-1 rounded-full text-sm text-center`}>
                      {formatStatus(order.orderStatus)}
                    </span>
                    <span className="text-white font-semibold">₹{order.pricing?.total?.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-n-3 mb-4">
                  <div>
                    <strong>Medicines:</strong> {order.medicines?.length || 0} items
                  </div>
                  <div>
                    <strong>Payment:</strong> {order.paymentDetails?.method || 'N/A'}
                  </div>
                  {order.blockchain?.batchId && (
                    <div className="md:col-span-2">
                      <strong>Blockchain Batch:</strong>{' '}
                      <a
                        href={`https://explorer.solana.com/address/${order.blockchain.batchId}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline break-all"
                      >
                        {order.blockchain.batchId}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                    className="text-sm"
                  >
                    {selectedOrder?._id === order._id ? 'Close' : 'Manage'}
                  </Button>
                </div>

                {/* Order Management Panel */}
                {selectedOrder?._id === order._id && (
                  <div className="mt-4 pt-4 border-t border-n-6 space-y-4">
                    {/* Status Update */}
                    <div>
                      <label className="block text-white mb-2">Update Status</label>
                      <div className="flex gap-2">
                        <select
                          value={statusUpdate}
                          onChange={(e) => setStatusUpdate(e.target.value)}
                          className="flex-1 bg-n-7 border border-n-6 rounded px-4 py-2 text-white"
                        >
                          <option value="">Select Status</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <Button onClick={() => handleStatusUpdate(order.orderId)}>
                          Update
                        </Button>
                      </div>
                    </div>

                    {/* Transfer Ownership */}
                    {order.blockchain?.batchId && (
                      <div>
                        <label className="block text-white mb-2">Transfer Ownership (On-Chain)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="New Owner Public Key (Solana address)"
                            value={transferOwner}
                            onChange={(e) => setTransferOwner(e.target.value)}
                            className="flex-1 bg-n-7 border border-n-6 rounded px-4 py-2 text-white font-mono text-sm"
                          />
                          <Button onClick={() => handleTransferOwnership(order.orderId)}>
                            Transfer
                          </Button>
                        </div>
                        <p className="text-n-4 text-xs mt-1">
                          Enter a valid Solana public key (44 characters). This will transfer ownership on-chain.
                        </p>
                      </div>
                    )}

                    {/* Order Details */}
                    <div>
                      <h4 className="text-white font-semibold mb-2">Medicines</h4>
                      <div className="space-y-2">
                        {order.medicines?.map((med, idx) => (
                          <div key={idx} className="flex justify-between text-sm text-n-3">
                            <span>{med.name} x {med.quantity}</span>
                            <span>₹{med.price?.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-2">Shipping Address</h4>
                      <div className="text-sm text-n-3">
                        <p>{order.shippingAddress?.fullName}</p>
                        <p>{order.shippingAddress?.addressLine1}</p>
                        {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress?.addressLine2}</p>}
                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                        <p>📞 {order.shippingAddress?.phone}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2"
            >
              ← Previous
            </Button>
            
            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-n-7 text-n-4 hover:bg-n-6'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <Button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2"
            >
              Next →
            </Button>
          </div>
        )}
      </div>
    </Section>
  );
};

export default AdminOrders;
