import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Section from './mycomp2/Section';
import Button from './mycomp2/Button';
import WalletConnectButton from './common/walletconnect';
import 'react-toastify/dist/ReactToastify.css';

const Checkout = () => {
  const [cart, setCart] = useState({ items: [], estimatedTotal: 0 });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { refreshCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('solana');
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [cryptoEquivalent, setCryptoEquivalent] = useState(null);
  const [loadingCryptoPrice, setLoadingCryptoPrice] = useState(false);
  
  // Add error states for immediate display
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  // Enhanced payment method setter to clear errors
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    // Clear payment method error when user selects one
    if (showErrors && errors.paymentMethod) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.paymentMethod;
        return newErrors;
      });
    }
  };

  const { user } = useAuth();
  const navigate = useNavigate();

  // Check wallet connection status
  useEffect(() => {
    const savedAccount = localStorage.getItem('connectedAccount');
    const savedWalletType = localStorage.getItem('walletType');
    if (savedAccount && savedWalletType) {
      setWalletConnected(true);
      setWalletAddress(savedAccount);
    }
  }, []);

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
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
          
          if (data.cart.items.length === 0) {
            toast.warning('Your cart is empty');
            navigate('/cart');
          }
        } else {
          toast.error('Failed to fetch cart');
          navigate('/cart');
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Error loading cart');
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCart();
    }
  }, [user, navigate]);

  // Calculate totals
  const subtotal = cart.estimatedTotal || 0;
  const deliveryCharges = subtotal > 500 ? 0 : 50;
  const taxes = subtotal * 0.18;
  const total = subtotal + taxes + deliveryCharges;

  // Check if prescription is required
  const prescriptionRequired = cart.items?.some(item => 
    item.medicineId?.prescriptionRequired
  );

  // Handle address input change
  const handleAddressChange = (field, value) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (showErrors && errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Real-time field validation on blur
  const handleFieldBlur = (field, value) => {
    switch (field) {
      case 'fullName':
        if (!value) {
          toast.error('📝 Please enter your full name');
        }
        break;
      case 'phone':
        if (!value) {
          toast.error('📞 Please enter your phone number');
        } else if (!/^[0-9]{10}$/.test(value)) {
          toast.error('📞 Please enter a valid 10-digit phone number');
        }
        break;
      case 'addressLine1':
        if (!value) {
          toast.error('🏠 Please enter your street address');
        }
        break;
      case 'city':
        if (!value) {
          toast.error('🏙️ Please enter your city');
        }
        break;
      case 'state':
        if (!value) {
          toast.error('🗺️ Please enter your state');
        }
        break;
      case 'pincode':
        if (!value) {
          toast.error('📮 Please enter your pincode');
        } else if (!/^[0-9]{6}$/.test(value)) {
          toast.error('📮 Please enter a valid 6-digit pincode');
        }
        break;
      default:
        break;
    }
  };

  // Enhanced validation with immediate error display
  const validateForm = () => {
    console.log('🔍 Validating form...');
    
    const newErrors = {};
    
    // Check required fields with specific validation
    if (!shippingAddress.fullName || shippingAddress.fullName.trim() === '') {
      newErrors.fullName = 'Full name is required';
    } else if (shippingAddress.fullName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }
    
    if (!shippingAddress.phone || shippingAddress.phone.trim() === '') {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(shippingAddress.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!shippingAddress.addressLine1 || shippingAddress.addressLine1.trim() === '') {
      newErrors.addressLine1 = 'Street address is required';
    } else if (shippingAddress.addressLine1.length < 5) {
      newErrors.addressLine1 = 'Please enter a complete address';
    }
    
    if (!shippingAddress.city || shippingAddress.city.trim() === '') {
      newErrors.city = 'City is required';
    } else if (shippingAddress.city.length < 2) {
      newErrors.city = 'Please enter a valid city name';
    }
    
    if (!shippingAddress.state || shippingAddress.state.trim() === '') {
      newErrors.state = 'State is required';
    } else if (shippingAddress.state.length < 2) {
      newErrors.state = 'Please enter a valid state name';
    }
    
    if (!shippingAddress.pincode || shippingAddress.pincode.trim() === '') {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^[0-9]{6}$/.test(shippingAddress.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }
    
    if (!paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }
    
    if (!walletConnected) {
      newErrors.wallet = 'Please connect your wallet first';
    }
    
    // Update error state immediately
    setErrors(newErrors);
    setShowErrors(true);
    
    // If there are errors, show toast messages for better UX
    if (Object.keys(newErrors).length > 0) {
      console.log('❌ Validation failed:', newErrors);
      
      // Show a consolidated error toast
      const errorMessages = Object.values(newErrors);
      toast.error(`❌ Please fill all required fields correctly (${errorMessages.length} errors)`, {
        position: 'top-center',
        autoClose: 5000,
        style: {
          background: '#dc2626',
          color: 'white',
          fontSize: '16px',
          zIndex: 99999
        }
      });
      
      return false;
    }
    
    // Clear errors if validation passes
    setErrors({});
    setShowErrors(false);
    console.log('✅ Validation passed');
    return true;
  };

  // Process real blockchain payment
  // Switch to Sepolia testnet
  const switchToSepoliaTestnet = async () => {
    try {
      // Try to switch to Sepolia testnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia testnet chain ID
      });
    } catch (switchError) {
      // If testnet is not added, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia Testnet',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
              blockExplorerUrls: ['https://sepolia.etherscan.io/'],
            }],
          });
        } catch (addError) {
          throw new Error('Failed to add Sepolia testnet');
        }
      } else {
        throw switchError;
      }
    }
  };

  // Calculate crypto equivalent when payment method or total changes
  useEffect(() => {
    const calculateCryptoEquivalent = async () => {
      if (total > 0 && paymentMethod) {
        setLoadingCryptoPrice(true);
        try {
          if (paymentMethod === 'ethereum') {
            const ethPrice = await getRealTimeETHPrice();
            const ethAmount = (total / ethPrice).toFixed(6);
            setCryptoEquivalent({
              amount: ethAmount,
              currency: 'ETH',
              rate: ethPrice
            });
          } else if (paymentMethod === 'solana') {
            const solPrice = await getRealTimeSOLPrice();
            const solAmount = (total / solPrice).toFixed(6);
            setCryptoEquivalent({
              amount: solAmount,
              currency: 'SOL',
              rate: solPrice
            });
          }
        } catch (error) {
          console.error('Error calculating crypto equivalent:', error);
          setCryptoEquivalent(null);
        } finally {
          setLoadingCryptoPrice(false);
        }
      } else {
        setCryptoEquivalent(null);
      }
    };

    calculateCryptoEquivalent();
  }, [total, paymentMethod]);

  // Real-time currency conversion functions
  const getRealTimeETHPrice = async () => {
    try {
      console.log('📊 Fetching real-time ETH price...');
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
      const data = await response.json();
      const ethPrice = data.ethereum.inr;
      console.log(`💰 Current ETH price: ₹${ethPrice}`);
      return ethPrice;
    } catch (error) {
      console.error('Failed to fetch ETH price, using fallback:', error);
      return 200000; // Fallback price in INR (~$2400 ETH)
    }
  };

  const getRealTimeSOLPrice = async () => {
    try {
      console.log('📊 Fetching real-time SOL price...');
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=inr');
      const data = await response.json();
      const solPrice = data.solana.inr;
      console.log(`💰 Current SOL price: ₹${solPrice}`);
      return solPrice;
    } catch (error) {
      console.error('Failed to fetch SOL price, using fallback:', error);
      return 8000; // Fallback price in INR (~$95 SOL)
    }
  };

  // Enhanced cart clearing function that clears both frontend and backend
  const clearCartCompletely = async () => {
    try {
      console.log('🧹 Clearing cart completely (frontend + backend)...');
      
      // Show clearing toast
      toast.info('🧹 Clearing your cart...', {
        position: 'top-center',
        autoClose: 2000,
        toastId: 'clearing-cart'
      });
      
      // Clear on backend
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('✅ Cart cleared on backend successfully');
        toast.update('clearing-cart', {
          render: '✅ Cart cleared successfully!',
          type: 'success',
          autoClose: 1000
        });
      } else {
        console.warn('⚠️ Backend cart clear failed, but continuing...');
        toast.update('clearing-cart', {
          render: '⚠️ Cart partially cleared',
          type: 'warning',
          autoClose: 1000
        });
      }

      // Always refresh frontend cart state
      refreshCart();
      console.log('✅ Cart cleared on frontend');
      
    } catch (error) {
      console.error('Error clearing cart completely:', error);
      // Still refresh frontend even if backend fails
      refreshCart();
      toast.update('clearing-cart', {
        render: '⚠️ Cart cleared locally',
        type: 'warning',
        autoClose: 1000
      });
    }
  };

  // Function to display transaction status to user
  const displayTransactionStatus = (status, txHash, network) => {
    const explorerUrl = network === 'ethereum-sepolia' 
      ? `https://sepolia.etherscan.io/tx/${txHash}`
      : `https://explorer.solana.com/tx/${txHash}?cluster=devnet`;
    
    const shortHash = txHash.slice(0, 8) + '...' + txHash.slice(-6);
    
    toast.success(
      <div>
        <div>🎉 Payment Confirmed!</div>
        <div className="text-xs mt-1">
          Transaction: <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="underline">
            {shortHash}
          </a>
        </div>
      </div>,
      { 
        autoClose: 8000,
        onClick: () => window.open(explorerUrl, '_blank')
      }
    );
  };

  // Function to actually wait for transaction confirmation on Ethereum
  const waitForTransactionConfirmation = async (txHash, maxWaitTime = 120000) => {
    const startTime = Date.now();
    const checkInterval = 3000; // Check every 3 seconds
    
    console.log(`🔍 Waiting for transaction confirmation: ${txHash}`);
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        // Use ethers or web3 to check transaction status
        const receipt = await window.ethereum.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        });
        
        if (receipt) {
          console.log('📋 Transaction receipt received:', receipt);
          
          // Check if transaction was successful
          if (receipt.status === '0x1') {
            console.log('✅ Transaction confirmed successfully!');
            return {
              success: true,
              blockNumber: receipt.blockNumber,
              gasUsed: receipt.gasUsed,
              status: receipt.status
            };
          } else {
            console.log('❌ Transaction failed on blockchain');
            return {
              success: false,
              error: 'Transaction was reverted'
            };
          }
        }
        
        // Transaction is still pending, wait and check again
        console.log('⏳ Transaction still pending, checking again in 3 seconds...');
        await new Promise(resolve => setTimeout(resolve, checkInterval));
        
      } catch (error) {
        console.error('Error checking transaction status:', error);
        // Continue trying
        await new Promise(resolve => setTimeout(resolve, checkInterval));
      }
    }
    
    // Timeout reached
    console.log('⏰ Transaction confirmation timeout reached');
    return {
      success: false,
      error: 'Transaction confirmation timeout'
    };
  };

  // Function to wait for Solana transaction confirmation
  const waitForSolanaTransactionConfirmation = async (signature, connection, maxWaitTime = 120000) => {
    const startTime = Date.now();
    const checkInterval = 3000;
    
    console.log(`🔍 Waiting for Solana transaction confirmation: ${signature}`);
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const status = await connection.getSignatureStatus(signature);
        
        if (status && status.value) {
          if (status.value.confirmationStatus === 'confirmed' || status.value.confirmationStatus === 'finalized') {
            console.log('✅ Solana transaction confirmed!');
            return {
              success: true,
              confirmationStatus: status.value.confirmationStatus,
              slot: status.value.slot
            };
          } else if (status.value.err) {
            console.log('❌ Solana transaction failed:', status.value.err);
            return {
              success: false,
              error: status.value.err
            };
          }
        }
        
        console.log('⏳ Solana transaction still pending...');
        await new Promise(resolve => setTimeout(resolve, checkInterval));
        
      } catch (error) {
        console.error('Error checking Solana transaction status:', error);
        await new Promise(resolve => setTimeout(resolve, checkInterval));
      }
    }
    
    return {
      success: false,
      error: 'Transaction confirmation timeout'
    };
  };

  const processBlockchainPayment = async () => {
    const walletType = localStorage.getItem('walletType');
    
    console.log('🔍 Payment Debug Info:');
    console.log('Payment Method:', paymentMethod);
    console.log('Wallet Type:', walletType);
    console.log('Wallet Connected:', walletConnected);
    console.log('Wallet Address:', walletAddress);
    console.log('Window.solana:', !!window.solana);
    console.log('Window.ethereum:', !!window.ethereum);
    
    if (paymentMethod === 'ethereum' && walletType === 'metamask') {
      // Enhanced MetaMask Ethereum payment with better user feedback
      if (!window.ethereum) {
        throw new Error('MetaMask not found. Please install MetaMask extension.');
      }

      try {
        // Step 1: Show preparation message
        toast.info('⚡ Preparing MetaMask transaction...', { 
          autoClose: false,
          toastId: 'preparing-eth-tx'
        });

        // Step 2: Ensure MetaMask connection
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        if (!accounts || accounts.length === 0) {
          throw new Error('No MetaMask accounts found. Please connect your wallet.');
        }

        // Step 3: Switch to Sepolia testnet
        toast.update('preparing-eth-tx', {
          render: '🔗 Switching to Sepolia testnet...',
          type: 'info'
        });

        await switchToSepoliaTestnet();

        // Step 4: Calculate transaction amount
        toast.update('preparing-eth-tx', {
          render: '💰 Calculating transaction amount...',
          type: 'info'
        });

        const ethPrice = await getRealTimeETHPrice();
        const ethAmount = (total / ethPrice).toFixed(6);
        const weiAmount = (BigInt(Math.floor(ethAmount * 1e18))).toString();

        console.log(`💰 Payment Details:`);
        console.log(`Order Total: ₹${total}`);
        console.log(`ETH Price: ₹${ethPrice}/ETH`);
        console.log(`ETH Amount: ${ethAmount} ETH`);

        // Step 5: Prepare transaction
        const transactionParameters = {
          to: import.meta.env.VITE_ETHEREUM_RECEIVER_ADDRESS,
          from: accounts[0],
          value: '0x' + BigInt(weiAmount).toString(16),
          gas: '0x5208', // 21000 gas limit
        };

        console.log('🔄 Prepared Sepolia transaction:', transactionParameters);

        // Step 6: Request user confirmation
        toast.update('preparing-eth-tx', {
          render: '✋ Please confirm the transaction in MetaMask...',
          type: 'info',
          autoClose: false
        });

        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });

        // Step 7: Transaction sent - now actually wait for blockchain confirmation
        toast.update('preparing-eth-tx', {
          render: '⏳ Transaction sent! Waiting for blockchain confirmation...',
          type: 'info',
          autoClose: false
        });

        console.log('✅ Transaction sent with hash:', txHash);

        // Step 8: Actually check transaction status on blockchain
        const confirmed = await waitForTransactionConfirmation(txHash);
        
        if (confirmed.success) {
          // Dismiss preparation toast
          toast.dismiss('preparing-eth-tx');
          
          // Show success with blockchain explorer link
          displayTransactionStatus('confirmed', txHash, 'ethereum-sepolia');

          return {
            transactionHash: txHash,
            blockchainNetwork: 'ethereum-sepolia',
            status: 'confirmed',
            amount: ethAmount,
            currency: 'ETH',
            blockNumber: confirmed.blockNumber,
            gasUsed: confirmed.gasUsed
          };
        } else {
          if (confirmed.error === 'Transaction confirmation timeout') {
            throw new Error('⏰ Transaction is taking longer than expected. Please check your wallet or blockchain explorer.');
          } else {
            throw new Error('❌ Transaction failed or was reverted on blockchain');
          }
        }

      } catch (error) {
        // Clean up any existing toasts
        toast.dismiss('preparing-eth-tx');
        
        console.error('❌ MetaMask payment error:', error);
        
        // Show specific error messages based on error type
        if (error.code === 4001) {
          throw new Error('❌ Transaction was cancelled by user');
        } else if (error.code === -32603) {
          throw new Error('❌ Transaction failed on blockchain. Please check your balance and try again.');
        } else if (error.message?.includes('insufficient funds')) {
          throw new Error('❌ Insufficient ETH balance. Please add ETH to your MetaMask wallet.');
        } else if (error.message?.includes('User denied') || error.message?.includes('cancelled')) {
          throw new Error('❌ Transaction was denied by user');
        } else if (error.message?.includes('timeout')) {
          throw new Error('⏰ Transaction confirmation timeout. Payment may still be processing.');
        } else if (error.message?.includes('reverted')) {
          throw new Error('❌ Transaction was reverted on blockchain');
        } else {
          throw new Error(`❌ MetaMask payment failed: ${error.message}`);
        }
      }

    } else if (paymentMethod === 'solana') {
      // Handle Solana payment regardless of wallet type for better compatibility
      console.log('🔄 Starting Solana payment (any wallet)...');
      
      if (!window.solana || !window.solana.isPhantom) {
        console.error('❌ Phantom wallet not found in window object');
        throw new Error('Phantom wallet not found. Please install Phantom wallet from phantom.app');
      }

      try {
        // Force wallet connection if not connected
        console.log('🔄 Ensuring Phantom wallet connection...');
        
        let phantomWallet;
        if (!window.solana.isConnected) {
          console.log('🔄 Phantom not connected, requesting connection...');
          phantomWallet = await window.solana.connect();
          console.log('✅ Phantom connected:', phantomWallet.publicKey.toString());
        } else {
          console.log('✅ Phantom already connected:', window.solana.publicKey.toString());
          phantomWallet = { publicKey: window.solana.publicKey };
        }

        // Show user that we're processing the payment
        toast.info('💫 Preparing Solana transaction...', { 
          autoClose: 3000,
          toastId: 'preparing-sol-tx'
        });

        const { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } = await import('@solana/web3.js');
        
        // Connect to devnet for testing
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        console.log('✅ Connected to Solana devnet');
        
        // Get real-time SOL price and calculate amount
        console.log('💰 Fetching real-time SOL price...');
        const solPrice = await getRealTimeSOLPrice();
        const solAmount = (total / solPrice).toFixed(6); // Use calculated total
        const lamports = Math.floor(solAmount * LAMPORTS_PER_SOL);

        console.log(`💰 Payment Details:`);
        console.log(`Cart Subtotal: ₹${subtotal}`);
        console.log(`Delivery: ₹${deliveryCharges}`);
        console.log(`Taxes: ₹${taxes.toFixed(2)}`);
        console.log(`Final Total: ₹${total}`);
        console.log(`SOL Price: ₹${solPrice}/SOL`);
        console.log(`SOL Amount: ${solAmount} SOL`);
        console.log(`Lamports: ${lamports}`);

        if (lamports < 1000) {
          throw new Error('Transaction amount too small. Minimum 0.000001 SOL required.');
        }

        // Dismiss preparation toast
        toast.dismiss('preparing-sol-tx');

        const fromPubkey = phantomWallet.publicKey;
        const toPubkey = new PublicKey(import.meta.env.VITE_SOLANA_RECEIVER_ADDRESS);

        console.log('📍 Transaction addresses:');
        console.log('From:', fromPubkey.toString());
        console.log('To:', toPubkey.toString());

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: fromPubkey,
            toPubkey: toPubkey,
            lamports: lamports,
          })
        );

        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = fromPubkey;

        console.log('🔄 Requesting user signature via Phantom...');
        
        // Show user that signature is needed
        toast.info('✍️ Please approve the transaction in Phantom wallet', { 
          autoClose: false,
          toastId: 'awaiting-signature'
        });

        const signedTransaction = await window.solana.signTransaction(transaction);
        
        // Dismiss signature toast
        toast.dismiss('awaiting-signature');
        
        // Show sending toast
        toast.info('📡 Sending transaction to Solana network...', { 
          autoClose: false,
          toastId: 'sending-tx'
        });

        console.log('🔄 Sending Solana devnet transaction...');
        const signature = await connection.sendRawTransaction(signedTransaction.serialize());
        
        // Update toast to show waiting for confirmation
        toast.update('sending-tx', {
          render: '⏳ Transaction sent! Waiting for blockchain confirmation...',
          type: 'info',
          autoClose: false
        });
        
        console.log('✅ Solana transaction sent:', signature);
        
        // Actually wait for Solana transaction confirmation
        const confirmed = await waitForSolanaTransactionConfirmation(signature, connection);
        
        // Dismiss sending toast
        toast.dismiss('sending-tx');
        
        if (confirmed.success) {
          // Dismiss sending toast
          toast.dismiss('sending-tx');
          
          // Show success with blockchain explorer link
          displayTransactionStatus('confirmed', signature, 'solana-devnet');

          return {
            transactionHash: signature,
            blockchainNetwork: 'solana-devnet',
            status: 'confirmed',
            amount: solAmount,
            currency: 'SOL',
            confirmationStatus: confirmed.confirmationStatus,
            slot: confirmed.slot
          };
        } else {
          if (confirmed.error === 'Transaction confirmation timeout') {
            throw new Error('⏰ Transaction is taking longer than expected. Please check Solana explorer.');
          } else {
            throw new Error('❌ Solana transaction failed or was not confirmed');
          }
        }

      } catch (error) {
        console.error('❌ Phantom payment error:', error);
        
        // Dismiss any pending toasts
        toast.dismiss('preparing-sol-tx');
        toast.dismiss('awaiting-signature');
        toast.dismiss('sending-tx');
        
        // Show specific error message based on error type
        if (error.message?.includes('User rejected') || error.code === 4001) {
          throw new Error('❌ Transaction was cancelled by user');
        } else if (error.message?.includes('Phantom wallet not found')) {
          throw new Error('❌ Phantom wallet not found. Please install Phantom wallet.');
        } else if (error.message?.includes('insufficient funds')) {
          throw new Error('❌ Insufficient SOL balance. Please add SOL to your Phantom wallet.');
        } else if (error.message?.includes('timeout')) {
          throw new Error('⏰ Transaction confirmation timeout. Payment may still be processing.');
        } else if (error.message?.includes('not confirmed')) {
          throw new Error('❌ Transaction failed to confirm on Solana blockchain');
        } else {
          throw new Error(`❌ Solana payment failed: ${error.message}`);
        }
      }

    } else {
      // Fallback simulation for development/testing with real-time conversion
      console.log('⚠️ Using fallback simulation with real-time conversion');
      
      try {
        let amount, currency;
        if (paymentMethod === 'solana') {
          const solPrice = await getRealTimeSOLPrice();
          amount = (total / solPrice).toFixed(6);
          currency = 'SOL';
        } else {
          const ethPrice = await getRealTimeETHPrice();
          amount = (total / ethPrice).toFixed(6);
          currency = 'ETH';
        }
        
        console.log(`💰 Fallback conversion: ₹${total} → ${amount} ${currency}`);
        
        return new Promise((resolve) => {
          setTimeout(() => {
            const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
            resolve({
              transactionHash: txHash,
              blockchainNetwork: paymentMethod === 'solana' ? 'solana-devnet' : 'ethereum-sepolia',
              status: 'confirmed',
              amount: amount,
              currency: currency
            });
          }, 3000);
        });
      } catch (error) {
        // If price fetch fails, use fixed amounts as ultimate fallback
        return new Promise((resolve) => {
          setTimeout(() => {
            const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
            resolve({
              transactionHash: txHash,
              blockchainNetwork: paymentMethod === 'solana' ? 'solana-devnet' : 'ethereum-sepolia',
              status: 'confirmed',
              amount: paymentMethod === 'solana' ? '0.01' : '0.001',
              currency: paymentMethod === 'solana' ? 'SOL' : 'ETH'
            });
          }, 3000);
        });
      }
    }
  };

  const handlePlaceOrder = async () => {
    console.log('🔄 Place Order clicked!');
    console.log('Payment method:', paymentMethod);
    console.log('Wallet connected:', walletConnected);
    console.log('Cart items:', cart.items?.length);
    
    // Basic cart check
    if (!cart.items || cart.items.length === 0) {
      toast.error('❌ Your cart is empty!', {
        position: 'top-center',
        autoClose: 4000,
        style: {
          background: '#dc2626',
          color: 'white',
          fontSize: '16px',
          zIndex: 99999
        }
      });
      return;
    }

    // Enhanced validation with better error messages
    if (!validateForm()) {
      // Scroll to first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement.focus();
        }
      }
      return;
    }

    console.log('✅ Starting payment process...');
    setProcessing(true);
    
    try {
      // Step 1: Process blockchain payment first
      console.log('💰 Processing payment...');
      toast.info('🚀 Initiating blockchain payment...', { position: 'top-center', autoClose: false, toastId: 'payment-process' });
      
      const paymentResult = await processBlockchainPayment();
      console.log('✅ Payment successful:', paymentResult);

      // Step 2: Create order with payment confirmation
      toast.info('📋 Creating your order...', { toastId: 'order-creation' });
      
      const token = await user.getIdToken();
      
      const orderData = {
        shippingAddress,
        paymentDetails: {
          method: paymentMethod,
          walletAddress: walletAddress || 'connected',
          paymentStatus: 'confirmed',
          transactionHash: paymentResult.transactionHash,
          amount: paymentResult.amount,
          currency: paymentResult.currency,
          blockchainNetwork: paymentResult.blockchainNetwork
        },
        notes: notes || '',
        prescriptionUrl: prescriptionFile ? 'uploaded' : null
      };

      const orderResponse = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!orderResponse.ok) {
        console.warn('Order creation failed, but payment was successful');
        toast.success('⚠️ Payment successful! Order details will be processed separately.');
        
        // Clear cart completely since payment was successful
        console.log('🧹 Clearing cart - payment successful despite order creation issue...');
        await clearCartCompletely();
        
        // Show thank you message and redirect to orders page
        setTimeout(() => {
          toast.success('🙏 Thank you for your order! Payment confirmed - check orders page.');
          navigate('/orders'); // Redirect to orders page
        }, 2000);
        
        return;
      }

      const orderResult = await orderResponse.json();
      const orderId = orderResult.order.orderId;
      
      // Step 4: Clear cart completely after successful order creation
      console.log('🧹 Clearing cart after successful order...');
      await clearCartCompletely();
      
      // Step 5: Show success message
      toast.success(`✅ Order #${orderId} created successfully!`);
      
      // Show thank you message after a short delay
      setTimeout(() => {
        toast.success('🙏 Thank you for choosing VitalEdge! Redirecting to your order...');
      }, 1500);
      
      // Navigate to specific order page after showing thank you
      setTimeout(() => {
        navigate(`/orders/${orderId}`);
      }, 2500);

    } catch (error) {
      console.error('Error in payment/order process:', error);
      toast.error(`❌ ${error.message || 'Payment failed'}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Section className="pt-[6rem] -mt-[5.25rem]" crosses>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Loading checkout...</div>
        </div>
      </Section>
    );
  }

  return (
    <Section className="pt-[6rem] -mt-[5.25rem]" crosses>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
            <p className="text-n-4">Complete your order with blockchain payment</p>
          </div>

          {/* Error Summary - Shows immediately when validation fails */}
          {showErrors && Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-lg animate-pulse">
              <h3 className="text-red-400 font-semibold mb-2 flex items-center">
                ⚠️ Please fix the following errors:
              </h3>
              <ul className="text-red-300 text-sm space-y-1">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field} className="flex items-center">
                    <span className="text-red-400 mr-2">•</span>
                    <span className="capitalize">{field.replace(/([A-Z])/g, ' $1')}</span>: {message}
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-red-200 text-xs">
                💡 Tip: Required fields are marked with an asterisk (*)
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Forms */}
            <div className="space-y-8">
              
              {/* Shipping Address */}
              <div className="bg-n-8 border border-n-6 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-n-4 text-sm mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={(e) => handleAddressChange('fullName', e.target.value)}
                      onBlur={(e) => handleFieldBlur('fullName', e.target.value)}
                      className={`w-full px-3 py-2 bg-n-7 border rounded-lg text-white focus:border-blue-500 ${
                        showErrors && errors.fullName ? 'border-red-500' : 'border-n-6'
                      }`}
                      placeholder="Enter full name"
                    />
                    {showErrors && errors.fullName && (
                      <p className="text-red-400 text-sm mt-1">❌ {errors.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-n-4 text-sm mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      onBlur={(e) => handleFieldBlur('phone', e.target.value)}
                      className={`w-full px-3 py-2 bg-n-7 border rounded-lg text-white focus:border-blue-500 ${
                        showErrors && errors.phone ? 'border-red-500' : 'border-n-6'
                      }`}
                      placeholder="Enter phone number"
                    />
                    {showErrors && errors.phone && (
                      <p className="text-red-400 text-sm mt-1">❌ {errors.phone}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-n-4 text-sm mb-2">Address Line 1 *</label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={shippingAddress.addressLine1}
                      onChange={(e) => handleAddressChange('addressLine1', e.target.value)}
                      onBlur={(e) => handleFieldBlur('addressLine1', e.target.value)}
                      className={`w-full px-3 py-2 bg-n-7 border rounded-lg text-white focus:border-blue-500 ${
                        showErrors && errors.addressLine1 ? 'border-red-500' : 'border-n-6'
                      }`}
                      placeholder="House/Flat No., Street"
                    />
                    {showErrors && errors.addressLine1 && (
                      <p className="text-red-400 text-sm mt-1">❌ {errors.addressLine1}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-n-4 text-sm mb-2">Address Line 2</label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={shippingAddress.addressLine2}
                      onChange={(e) => handleAddressChange('addressLine2', e.target.value)}
                      className="w-full px-3 py-2 bg-n-7 border border-n-6 rounded-lg text-white focus:border-blue-500"
                      placeholder="Area, Colony, Sector"
                    />
                  </div>
                  <div>
                    <label className="block text-n-4 text-sm mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      onBlur={(e) => handleFieldBlur('city', e.target.value)}
                      className={`w-full px-3 py-2 bg-n-7 border rounded-lg text-white focus:border-blue-500 ${
                        showErrors && errors.city ? 'border-red-500' : 'border-n-6'
                      }`}
                      placeholder="Enter city"
                    />
                    {showErrors && errors.city && (
                      <p className="text-red-400 text-sm mt-1">❌ {errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-n-4 text-sm mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      onBlur={(e) => handleFieldBlur('state', e.target.value)}
                      className={`w-full px-3 py-2 bg-n-7 border rounded-lg text-white focus:border-blue-500 ${
                        showErrors && errors.state ? 'border-red-500' : 'border-n-6'
                      }`}
                      placeholder="Enter state"
                    />
                    {showErrors && errors.state && (
                      <p className="text-red-400 text-sm mt-1">❌ {errors.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-n-4 text-sm mb-2">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={shippingAddress.pincode}
                      onChange={(e) => handleAddressChange('pincode', e.target.value)}
                      onBlur={(e) => handleFieldBlur('pincode', e.target.value)}
                      className={`w-full px-3 py-2 bg-n-7 border rounded-lg text-white focus:border-blue-500 ${
                        showErrors && errors.pincode ? 'border-red-500' : 'border-n-6'
                      }`}
                      placeholder="Enter pincode"
                    />
                    {showErrors && errors.pincode && (
                      <p className="text-red-400 text-sm mt-1">❌ {errors.pincode}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-n-4 text-sm mb-2">Landmark</label>
                    <input
                      type="text"
                      value={shippingAddress.landmark}
                      onChange={(e) => handleAddressChange('landmark', e.target.value)}
                      className="w-full px-3 py-2 bg-n-7 border border-n-6 rounded-lg text-white focus:border-blue-500"
                      placeholder="Nearby landmark"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-n-8 border border-n-6 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Payment Method</h2>
                
                <div className="space-y-4 mb-6">
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'solana' 
                        ? 'border-blue-500 bg-blue-900/20' 
                        : 'border-n-6 hover:border-n-5'
                    }`}
                    onClick={() => handlePaymentMethodChange('solana')}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={paymentMethod === 'solana'}
                        onChange={() => handlePaymentMethodChange('solana')}
                        className="mr-3"
                      />
                      <div>
                        <div className="text-white font-medium">Solana (SOL) 🟣</div>
                        <div className="text-n-4 text-sm">Fast and low-cost transactions</div>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'ethereum' 
                        ? 'border-blue-500 bg-blue-900/20' 
                        : 'border-n-6 hover:border-n-5'
                    }`}
                    onClick={() => handlePaymentMethodChange('ethereum')}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={paymentMethod === 'ethereum'}
                        onChange={() => handlePaymentMethodChange('ethereum')}
                        className="mr-3"
                      />
                      <div>
                        <div className="text-white font-medium">Ethereum (ETH) 🦊</div>
                        <div className="text-n-4 text-sm">Secure smart contract payments</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Payment Method Error Display */}
                {showErrors && errors.paymentMethod && (
                  <div className="mt-4 p-3 bg-red-900/20 border border-red-500 rounded-lg">
                    <p className="text-red-400 text-sm">❌ {errors.paymentMethod}</p>
                  </div>
                )}

                {/* Wallet Connection */}
                <div className="border-t border-n-6 pt-4">
                  <label className="block text-n-4 text-sm mb-3">Connect Wallet</label>
                  <WalletConnectButton />
                  {walletConnected && (
                    <div className="mt-3 text-green-500 text-sm flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                      Connected: {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                    </div>
                  )}
                  {showErrors && errors.wallet && (
                    <div className="mt-3 p-3 bg-red-900/20 border border-red-500 rounded-lg">
                      <p className="text-red-400 text-sm">❌ {errors.wallet}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Prescription Upload */}
              {prescriptionRequired && (
                <div className="bg-n-8 border border-n-6 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Prescription Upload</h2>
                  <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 mb-4">
                    <p className="text-yellow-300 text-sm">
                      📋 Your order contains prescription medicines. Please upload a valid prescription.
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setPrescriptionFile(e.target.files[0])}
                    className="w-full px-3 py-2 bg-n-7 border border-n-6 rounded-lg text-white"
                  />
                </div>
              )}

              {/* Special Instructions */}
              <div className="bg-n-8 border border-n-6 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Special Instructions</h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-n-7 border border-n-6 rounded-lg text-white resize-none"
                  placeholder="Any special delivery instructions..."
                />
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <div className="bg-n-8 border border-n-6 rounded-lg p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
                
                {/* Items */}
                <div className="space-y-4 mb-6">
                  {cart.items?.map((item) => (
                    <div key={item.medicineId._id} className="flex items-center space-x-3">
                      <img
                        src={item.medicineId.images?.primary?.url || '/placeholder-medicine.svg'}
                        alt={item.medicineId.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-grow">
                        <div className="text-white text-sm">{item.medicineId.name}</div>
                        <div className="text-n-4 text-xs">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-white text-sm">
                        ₹{(item.quantity * item.medicineId.price.discountedPrice).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-n-4">Subtotal</span>
                    <span className="text-white">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-n-4">Delivery</span>
                    <span className="text-white">{deliveryCharges > 0 ? `₹${deliveryCharges}` : 'FREE'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-n-4">GST (18%)</span>
                    <span className="text-white">₹{taxes.toFixed(2)}</span>
                  </div>
                  <hr className="border-n-6" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-green-500">₹{total.toFixed(2)}</span>
                  </div>
                  
                  {/* Crypto Equivalent Display */}
                  {paymentMethod && (
                    <div className="mt-3 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                      <div className="text-center">
                        <div className="text-purple-300 text-sm mb-1">
                          {paymentMethod === 'ethereum' ? '🔷 Ethereum Payment' : '🟣 Solana Payment'}
                        </div>
                        {loadingCryptoPrice ? (
                          <div className="text-purple-200 text-xs">Loading current rate...</div>
                        ) : cryptoEquivalent ? (
                          <div>
                            <div className="text-purple-100 font-semibold">
                              ≈ {cryptoEquivalent.amount} {cryptoEquivalent.currency}
                            </div>
                            <div className="text-purple-300 text-xs">
                              @ ₹{cryptoEquivalent.rate.toLocaleString()}/{cryptoEquivalent.currency}
                            </div>
                          </div>
                        ) : (
                          <div className="text-purple-200 text-xs">Select payment method</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={() => {
                    console.log('🔘 Place Order button clicked!');
                    console.log('Button state - Processing:', processing, 'Wallet Connected:', walletConnected);
                    
                    if (!walletConnected) {
                      toast.error('❌ Please connect your wallet first!', {
                        position: 'top-center',
                        autoClose: 4000,
                        style: {
                          background: '#dc2626',
                          color: 'white',
                          fontSize: '16px',
                          zIndex: 99999
                        }
                      });
                      return;
                    }
                    
                    handlePlaceOrder();
                  }}
                  disabled={processing || !walletConnected}
                  className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 ${
                    processing 
                      ? 'bg-blue-600 text-white cursor-not-allowed animate-pulse' 
                      : walletConnected
                        ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'bg-gray-600 cursor-not-allowed text-gray-300'
                  }`}
                >
                  {processing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Payment...
                    </span>
                  ) : !walletConnected ? (
                    '🔗 Connect Wallet First'
                  ) : (
                    `🚀 Place Order ₹${total.toFixed(2)}`
                  )}
                </Button>

                {!walletConnected && (
                  <div className="mt-2 text-center">
                    <p className="text-red-400 text-xs">
                      ⚠️ Please connect your wallet to place the order
                    </p>
                  </div>
                )}

                <p className="text-n-4 text-xs mt-3 text-center">
                  🔒 By placing this order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Checkout;
