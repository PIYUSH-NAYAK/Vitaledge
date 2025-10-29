import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Section from './mycomp2/Section';
import Button from './mycomp2/Button';

const OrderDetails = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancelling(true);
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
        await response.json(); // Response acknowledged
        setOrder(prev => ({ ...prev, orderStatus: 'cancelled' }));
        toast.success('Order cancelled successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Error cancelling order');
    } finally {
      setCancelling(false);
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = await user.getIdToken();
        const response = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/orders/${orderId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('📦 Order data received:', data.order);
          console.log('🔗 Blockchain data:', data.order?.blockchain);
          console.log('📊 On-chain data:', data.order?.blockchain?.onChainData);
          setOrder(data.order);
        } else {
          toast.error('Order not found');
          navigate('/orders');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Error loading order');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };

    if (user && orderId) {
      fetchOrderDetails();
    }
  }, [user, orderId, navigate]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-500',
      confirmed: 'text-blue-500',
      processing: 'text-purple-500',
      shipped: 'text-indigo-500',
      out_for_delivery: 'text-orange-500',
      delivered: 'text-green-500',
      cancelled: 'text-red-500'
    };
    return colors[status] || 'text-gray-500';
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <Section className="pt-[6rem] -mt-[5.25rem]" crosses>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Loading order details...</div>
        </div>
      </Section>
    );
  }

  if (!order) {
    return (
      <Section className="pt-[6rem] -mt-[5.25rem]" crosses>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Order Not Found</h2>
            <Button
              onClick={() => navigate('/orders')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Back to Orders
            </Button>
          </div>
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
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Order Details</h1>
              <p className="text-n-4">Order #{order.orderId}</p>
            </div>
            <Button
              onClick={() => navigate('/orders')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
            >
              Back to Orders
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Order Info */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Order Status */}
              <div className="bg-n-8 border border-n-6 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Order Status</h2>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-2xl font-bold ${getStatusColor(order.orderStatus)}`}>
                    {formatStatus(order.orderStatus)}
                  </span>
                  <span className="text-n-4 text-sm">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                {order.tracking?.estimatedDelivery && (
                  <div className="bg-n-7 border border-n-6 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-n-4">Estimated Delivery:</span>
                      <span className="text-white font-medium">
                        {new Date(order.tracking.estimatedDelivery).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Medicines Ordered */}
              <div className="bg-n-8 border border-n-6 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Medicines Ordered</h2>
                <div className="space-y-4">
                  {order.medicines.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-n-7 border border-n-6 rounded-lg">
                      <img
                        src={item.medicineId?.images?.primary?.url || '/placeholder-medicine.svg'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-grow">
                        <h3 className="text-white font-medium">{item.name}</h3>
                        <p className="text-n-4 text-sm">Batch: {item.batchNumber}</p>
                        <p className="text-n-4 text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">₹{item.price.toFixed(2)}</div>
                        <div className="text-n-4 text-sm">per unit</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-n-8 border border-n-6 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Shipping Address</h2>
                <div className="text-n-2">
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.phone}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                  {order.shippingAddress.landmark && (
                    <p className="text-n-4 text-sm">Near: {order.shippingAddress.landmark}</p>
                  )}
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-n-8 border border-n-6 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Payment Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-n-4">Payment Method:</span>
                    <span className="text-white capitalize">{order.paymentDetails.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-n-4">Payment Status:</span>
                    <span className={`capitalize ${
                      order.paymentDetails.paymentStatus === 'confirmed' 
                        ? 'text-green-500' 
                        : order.paymentDetails.paymentStatus === 'failed'
                        ? 'text-red-500'
                        : 'text-yellow-500'
                    }`}>
                      {order.paymentDetails.paymentStatus}
                    </span>
                  </div>
                  {order.paymentDetails.transactionHash && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-n-4">Transaction Hash:</span>
                        <span className="text-blue-400 text-sm font-mono">
                          {order.paymentDetails.transactionHash.slice(0, 10)}...
                          {order.paymentDetails.transactionHash.slice(-10)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-n-4">Blockchain Receipt:</span>
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
                          className="text-blue-400 hover:text-blue-300 underline text-sm flex items-center gap-1"
                        >
                          🔗 View Receipt
                        </a>
                      </div>
                    </>
                  )}
                  {order.paymentDetails.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-n-4">Paid At:</span>
                      <span className="text-white">
                        {new Date(order.paymentDetails.paidAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Blockchain Tracking Information */}
              {order.blockchain?.batchId && (
                <div className="bg-n-8 border border-n-6 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">🔗</span>
                    Blockchain Tracking
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Batch Info - Always show if batchId exists */}
                    <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                      <h3 className="text-purple-300 font-medium mb-3">Batch Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-n-4">Batch ID:</span>
                          <a
                            href={`https://explorer.solana.com/address/${order.blockchain.batchId}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 underline font-mono text-xs"
                          >
                            {order.blockchain.batchId.slice(0, 8)}...{order.blockchain.batchId.slice(-8)}
                          </a>
                        </div>
                        {order.blockchain.contractAddress && (
                          <div className="flex justify-between">
                            <span className="text-n-4">Contract:</span>
                            <span className="text-purple-300 font-mono text-xs">
                              {order.blockchain.contractAddress.slice(0, 8)}...
                            </span>
                          </div>
                        )}
                        {order.blockchain.transactionHash && (
                          <div className="flex justify-between">
                            <span className="text-n-4">Transaction:</span>
                            <a
                              href={`https://explorer.solana.com/tx/${order.blockchain.transactionHash}?cluster=devnet`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:text-purple-300 underline font-mono text-xs"
                            >
                              View on Explorer
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Show on-chain data if available, otherwise show loading/fetch message */}
                    {order.blockchain.onChainData ? (
                      <>
                        {/* Ownership Tracking */}
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                          <h3 className="text-blue-300 font-medium mb-3">Current Ownership</h3>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-n-4 block mb-1">Owner:</span>
                              <a
                                href={`https://explorer.solana.com/address/${order.blockchain.onChainData.currentOwner}?cluster=devnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 underline font-mono text-xs break-all"
                              >
                                {order.blockchain.onChainData.currentOwner}
                              </a>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-n-4">Status:</span>
                              <span className={order.blockchain.onChainData.isActive ? 'text-green-400' : 'text-red-400'}>
                                {order.blockchain.onChainData.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Ownership History */}
                        {order.blockchain.onChainData.ownershipHistory && order.blockchain.onChainData.ownershipHistory.length > 0 && (
                          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                            <h3 className="text-green-300 font-medium mb-3">Ownership History</h3>
                            <div className="space-y-3">
                              {order.blockchain.onChainData.ownershipHistory.map((record, idx) => (
                                <div key={idx} className="flex items-start gap-3 text-sm">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-semibold">
                                    {idx + 1}
                                  </div>
                                  <div className="flex-grow min-w-0">
                                    <div className="text-n-4 text-xs mb-1">
                                      {new Date(record.timestamp).toLocaleString('en-IN')}
                                    </div>
                                    <a
                                      href={`https://explorer.solana.com/address/${record.owner}?cluster=devnet`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-green-400 hover:text-green-300 underline font-mono text-xs break-all"
                                    >
                                      {record.owner}
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <p className="text-n-4 text-xs mt-3">
                              This medicine batch has been transferred {order.blockchain.onChainData.ownershipHistory.length} time(s) on the blockchain, ensuring authenticity and traceability.
                            </p>
                          </div>
                        )}

                        {/* Manufacturer Info */}
                        <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                          <h3 className="text-orange-300 font-medium mb-3">Manufacturer</h3>
                          <a
                            href={`https://explorer.solana.com/address/${order.blockchain.onChainData.manufacturer}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-400 hover:text-orange-300 underline font-mono text-xs break-all"
                          >
                            {order.blockchain.onChainData.manufacturer}
                          </a>
                          <p className="text-n-4 text-xs mt-2">
                            Created on {new Date(order.blockchain.onChainData.createdAt).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
                          <div>
                            <h3 className="text-yellow-300 font-medium">Fetching On-Chain Data...</h3>
                            <p className="text-yellow-200 text-xs mt-1">
                              Reading ownership information from Solana blockchain
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-2 text-xs text-n-4 bg-n-7 rounded p-3">
                      <svg className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>
                        All ownership changes are permanently recorded on the Solana blockchain, ensuring complete transparency and preventing counterfeit medicines.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* QR Code for Verification */}
              {order.qrCode && (
                <div className="bg-n-8 border border-n-6 rounded-lg p-6 mt-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Order Verification</h2>
                  <div className="flex flex-col items-center">
                    <div className="bg-white p-4 rounded-lg mb-4">
                      <img 
                        src={order.qrCode} 
                        alt="Order QR Code" 
                        className="w-48 h-48"
                      />
                    </div>
                    <p className="text-n-4 text-sm text-center mb-2">
                      Scan this QR code to verify your order
                    </p>
                    <p className="text-n-3 text-xs text-center">
                      Share this with delivery partner for authentication
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-n-8 border border-n-6 rounded-lg p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-n-4">Subtotal</span>
                    <span className="text-white">₹{order.pricing.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-n-4">Delivery</span>
                    <span className="text-white">
                      {order.pricing.deliveryCharges > 0 
                        ? `₹${order.pricing.deliveryCharges.toFixed(2)}` 
                        : 'FREE'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-n-4">GST</span>
                    <span className="text-white">₹{order.pricing.taxes.toFixed(2)}</span>
                  </div>
                  <hr className="border-n-6" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-green-500">₹{order.pricing.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/orders')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                  >
                    Back to Orders
                  </Button>
                  
                  {order.orderStatus === 'delivered' && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                    >
                      Reorder
                    </Button>
                  )}
                  
                  {['pending', 'confirmed'].includes(order.orderStatus) && (
                    <Button
                      onClick={handleCancelOrder}
                      disabled={cancelling}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white py-2 rounded-lg"
                    >
                      {cancelling ? 'Cancelling...' : 'Cancel Order'}
                    </Button>
                  )}
                </div>

                {/* Blockchain Info */}
                {order.blockchain?.batchId && (
                  <div className="mt-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                    <h3 className="text-purple-300 font-medium mb-2">🔗 Blockchain Verified</h3>
                    <p className="text-purple-200 text-xs">
                      Batch ID: {order.blockchain.batchId.slice(0, 8)}...
                    </p>
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

export default OrderDetails;
