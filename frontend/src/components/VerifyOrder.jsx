import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Section from './mycomp2/Section';
import Button from './mycomp2/Button';

const VerifyOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyOrder = async () => {
      try {
        // Public endpoint - no authentication required
        const response = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/orders/verify/${orderId}`
        );

        if (response.ok) {
          const data = await response.json();
          setOrder(data.order);
          setVerified(true);
          toast.success('✅ Order verified successfully!');
        } else {
          toast.error('❌ Order not found or invalid');
        }
      } catch (error) {
        console.error('Error verifying order:', error);
        toast.error('Error verifying order');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      verifyOrder();
    }
  }, [orderId]);

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
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">🔍 Verifying order...</div>
        </div>
      </Section>
    );
  }

  if (!verified || !order) {
    return (
      <Section className="pt-[6rem] -mt-[5.25rem]" crosses>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-n-8 border border-red-500 rounded-lg p-8 max-w-md text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-white mb-2">Order Not Found</h1>
            <p className="text-n-4 mb-4">
              The order you are trying to verify does not exist or the QR code is invalid.
            </p>
            <Button href="/" className="mt-4">
              Go to Homepage
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
          
          {/* Verification Success Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-green-500/20 border border-green-500 rounded-full p-4 mb-4">
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">✅ Order Verified</h1>
            <p className="text-n-4">This is a genuine VitalEdge order</p>
          </div>

          {/* Order Information */}
          <div className="bg-n-8 border border-n-6 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Order Information</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-n-4 text-sm mb-1">Order ID</p>
                <p className="text-white font-mono">{order.orderId}</p>
              </div>
              <div>
                <p className="text-n-4 text-sm mb-1">Order Date</p>
                <p className="text-white">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-n-4 text-sm mb-2">Status</p>
              <div className="flex items-center gap-2">
                <span className={`${getStatusColor(order.orderStatus)} text-white px-3 py-1 rounded-full text-sm`}>
                  {formatStatus(order.orderStatus)}
                </span>
              </div>
            </div>

            {/* Blockchain Verification */}
            {order.paymentDetails?.transactionHash && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h3 className="text-blue-400 font-semibold">Blockchain Verified</h3>
                </div>
                <p className="text-n-4 text-sm mb-2">Payment confirmed on {order.paymentDetails.blockchainNetwork}</p>
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
                  🔗 View on Blockchain Explorer
                </a>
              </div>
            )}
          </div>

          {/* On-chain Batch Data (if available) */}
          {order.blockchain?.onChainData && (
            <div className="bg-n-8 border border-n-6 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">On-chain Batch Data</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-n-4 text-sm mb-1">Batch Account</p>
                  <p className="text-white font-mono break-all">{order.blockchain.batchId}</p>
                </div>
                <div>
                  <p className="text-n-4 text-sm mb-1">Active</p>
                  <p className="text-white">{order.blockchain.onChainData.isActive ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-n-4 text-sm mb-1">Manufacturer</p>
                <a
                  href={`https://explorer.solana.com/address/${order.blockchain.onChainData.manufacturer}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline break-all"
                >
                  {order.blockchain.onChainData.manufacturer}
                </a>
              </div>

              <div className="mb-4">
                <p className="text-n-4 text-sm mb-1">Current Owner</p>
                <a
                  href={`https://explorer.solana.com/address/${order.blockchain.onChainData.currentOwner}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline break-all"
                >
                  {order.blockchain.onChainData.currentOwner}
                </a>
              </div>

              <div className="mb-4">
                <p className="text-n-4 text-sm mb-1">Created At</p>
                <p className="text-white">{new Date(order.blockchain.onChainData.createdAt).toLocaleString('en-IN')}</p>
              </div>

              <div className="mb-4">
                <p className="text-n-4 text-sm mb-2">Ownership History</p>
                <div className="space-y-2">
                  {order.blockchain.onChainData.ownershipHistory && order.blockchain.onChainData.ownershipHistory.length > 0 ? (
                    order.blockchain.onChainData.ownershipHistory.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-6">{idx + 1}.</div>
                        <div className="flex-1">
                          <a
                            href={`https://explorer.solana.com/address/${rec.owner}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline break-all"
                          >
                            {rec.owner}
                          </a>
                          <div className="text-n-4 text-sm">{new Date(rec.timestamp).toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-n-4 text-sm">No ownership history on-chain</div>
                  )}
                </div>
              </div>

              <div className="mt-2 text-sm text-n-4">This data is read directly from the on-chain batch account associated with this order.</div>
            </div>
          )}

          {/* Medicines Ordered */}
          <div className="bg-n-8 border border-n-6 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Medicines Ordered</h2>
            <div className="space-y-3">
              {order.medicines.map((medicine, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-n-6 last:border-0">
                  <div>
                    <p className="text-white font-medium">{medicine.name}</p>
                    {medicine.batchNumber && (
                      <p className="text-n-4 text-sm">Batch: {medicine.batchNumber}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-white">Qty: {medicine.quantity}</p>
                    <p className="text-n-4 text-sm">₹{medicine.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-n-6">
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-white">Total</span>
                <span className="text-white">₹{order.pricing.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-n-8 border border-n-6 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Delivery Address</h2>
            <div className="text-n-3">
              <p className="font-semibold text-white">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p className="mt-2">📞 {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-6 py-3">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-500 font-semibold">Verified by VitalEdge</span>
            </div>
          </div>

        </div>
      </div>
    </Section>
  );
};

export default VerifyOrder;
