"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function WalletConnectButton() {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletType, setWalletType] = useState(null); // MetaMask or Phantom
  const [showWalletOptions, setShowWalletOptions] = useState(false); // New state for wallet selection

  // ✅ Restore the account from local storage
  useEffect(() => {
    const savedAccount = localStorage.getItem("connectedAccount");
    const savedWalletType = localStorage.getItem("walletType");
    if (savedAccount && savedWalletType) {
      setAccount(savedAccount);
      setWalletType(savedWalletType);
    }
  }, []);

  // ✅ Check if wallets are installed
  const isPhantomInstalled = () => {
    const hasPhantom = typeof window !== "undefined" && window.solana && window.solana.isPhantom;
    console.log("🔍 Phantom detection:", hasPhantom);
    return hasPhantom;
  };

  const isMetaMaskInstalled = () => {
    const hasEthereum = typeof window !== "undefined" && window.ethereum;
    const isMetaMask = hasEthereum && (window.ethereum.isMetaMask || window.ethereum.providers?.some(p => p.isMetaMask));
    console.log("🔍 MetaMask detection:", isMetaMask, "| Ethereum:", !!hasEthereum);
    return isMetaMask;
  };

  // ✅ Debug wallet availability on component mount
  useEffect(() => {
    console.log("🔍 Checking wallet availability...");
    console.log("Window object:", typeof window);
    console.log("Window.solana:", window?.solana);
    console.log("Window.ethereum:", window?.ethereum);
    console.log("Window.ethereum.isMetaMask:", window?.ethereum?.isMetaMask);
    console.log("Window.ethereum.providers:", window?.ethereum?.providers);
    
    // Check if MetaMask is in providers array
    if (window?.ethereum?.providers) {
      const metamaskProvider = window.ethereum.providers.find(p => p.isMetaMask);
      console.log("MetaMask provider found in array:", !!metamaskProvider);
    }
    
    console.log("Phantom installed:", isPhantomInstalled());
    console.log("MetaMask installed:", isMetaMaskInstalled());
    
    // Try to detect MetaMask with different methods
    console.log("--- MetaMask Detection Methods ---");
    console.log("Method 1 - Direct isMetaMask:", window?.ethereum?.isMetaMask);
    console.log("Method 2 - Provider array:", window?.ethereum?.providers?.some(p => p.isMetaMask));
    console.log("Method 3 - Constructor name:", window?.ethereum?.constructor?.name);
    
  }, []);

  // ✅ Connect to Phantom Wallet
  const connectPhantom = async () => {
    if (!isPhantomInstalled()) {
      toast.error("Phantom wallet is not installed!");
      window.open("https://phantom.app/", "_blank");
      return;
    }

    try {
      setIsConnecting(true);
      
      // Request connection to Phantom
      const response = await window.solana.connect({ onlyIfTrusted: false });
      const phantomAddress = response.publicKey.toString();

      setAccount(phantomAddress);
      setWalletType("phantom");
      localStorage.setItem("connectedAccount", phantomAddress);
      localStorage.setItem("walletType", "phantom");

      toast.success("Successfully connected to Phantom!");
      console.log("✅ Connected to Phantom:", phantomAddress);
    } catch (error) {
      console.error("❌ Error connecting to Phantom:", error);
      if (error.code === 4001) {
        toast.error("Connection rejected by user");
      } else {
        toast.error("Failed to connect to Phantom wallet");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // ✅ Connect to MetaMask Wallet
  const connectMetaMask = async () => {
    console.log("🔄 Attempting MetaMask connection...");
    
    if (!window.ethereum) {
      console.log("❌ No window.ethereum found");
      toast.error("MetaMask is not installed!");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    // Handle multiple wallet providers (like when both MetaMask and other wallets are installed)
    let ethereum = window.ethereum;
    if (window.ethereum.providers) {
      console.log("🔍 Multiple providers detected:", window.ethereum.providers.length);
      ethereum = window.ethereum.providers.find(p => p.isMetaMask) || window.ethereum;
    }

    if (!ethereum) {
      toast.error("MetaMask provider not found!");
      return;
    }

    try {
      setIsConnecting(true);
      console.log("🔄 Requesting MetaMask accounts...");

      // Request MetaMask accounts with explicit provider
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("📝 MetaMask accounts received:", accounts);

      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        setWalletType("metamask");
        localStorage.setItem("connectedAccount", accounts[0]);
        localStorage.setItem("walletType", "metamask");

        toast.success("Successfully connected to MetaMask!");
        console.log("✅ Connected to MetaMask:", accounts[0]);
      } else {
        throw new Error("No accounts returned from MetaMask");
      }
    } catch (error) {
      console.error("❌ Error connecting to MetaMask:", error);
      
      // Better error handling
      if (error.code === 4001) {
        toast.error("MetaMask connection rejected by user");
      } else if (error.code === -32002) {
        toast.error("MetaMask connection request already pending");
      } else if (error.message?.includes("User denied")) {
        toast.error("Connection rejected by user");
      } else {
        toast.error(`Failed to connect to MetaMask: ${error.message || "Unknown error"}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // ✅ Auto-detect and connect wallet
  const connectWallet = async () => {
    console.log("🚀 Starting wallet connection...");
    console.log("Phantom available:", isPhantomInstalled());
    console.log("MetaMask available:", isMetaMaskInstalled());
    
    // If only MetaMask is available, connect directly
    if (isMetaMaskInstalled() && !isPhantomInstalled()) {
      console.log("🦊 Only MetaMask detected, connecting...");
      await connectMetaMask();
      return;
    }
    
    // If only Phantom is available, connect directly  
    if (isPhantomInstalled() && !isMetaMaskInstalled()) {
      console.log("🟣 Only Phantom detected, connecting...");
      await connectPhantom();
      return;
    }
    
    // If both wallets are available, show wallet selection UI
    if (isPhantomInstalled() && isMetaMaskInstalled()) {
      console.log("🔄 Both wallets detected, showing selection...");
      setShowWalletOptions(true);
      return;
    }
    
    // No wallets detected - show installation options
    console.log("❌ No wallets detected");
    toast.error("No supported wallet found!");
    setShowWalletOptions(true); // Show options to install wallets
  };

  // ✅ Handle wallet selection
  const handleWalletSelection = async (selectedWallet) => {
    setShowWalletOptions(false);
    
    if (selectedWallet === 'phantom') {
      if (isPhantomInstalled()) {
        await connectPhantom();
      } else {
        window.open("https://phantom.app/", "_blank");
      }
    } else if (selectedWallet === 'metamask') {
      if (isMetaMaskInstalled()) {
        await connectMetaMask();
      } else {
        window.open("https://metamask.io/download/", "_blank");
      }
    }
  };

  // ✅ Close wallet selection
  const closeWalletOptions = () => {
    setShowWalletOptions(false);
  };

  // ✅ Disconnect Wallet and Clear Data
  const disconnectWallet = () => {
    setAccount(null);
    setWalletType(null);
    localStorage.removeItem("connectedAccount");
    localStorage.removeItem("walletType");
    toast.success("Wallet disconnected");
    console.log("🔌 Wallet disconnected");
  };

  // ✅ Format wallet address
  const formatAccount = (address) => {
    if (address) {
      return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }
    return "";
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {!account ? (
        <>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className={`btn btn-primary btn-outline ${
              isConnecting ? "bg-gray-400 cursor-not-allowed" : ""
            } text-white py-2 px-4 rounded-lg transition duration-300`}
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>

          {/* Wallet Selection Modal */}
          {showWalletOptions && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-n-8 border border-n-6 rounded-xl p-6 max-w-sm w-full mx-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Choose Wallet</h3>
                  <p className="text-sm text-n-4">Select your preferred wallet to connect</p>
                </div>

                <div className="space-y-3">
                  {/* MetaMask Option */}
                  <button
                    onClick={() => handleWalletSelection('metamask')}
                    className="w-full flex items-center space-x-3 p-4 bg-n-7 hover:bg-n-6 border border-n-6 rounded-lg transition duration-200"
                  >
                    <div className="text-2xl">🦊</div>
                    <div className="text-left">
                      <div className="text-white font-medium">MetaMask</div>
                      <div className="text-xs text-n-4">
                        {isMetaMaskInstalled() ? "Ethereum & EVM chains" : "Install MetaMask"}
                      </div>
                    </div>
                    {!isMetaMaskInstalled() && (
                      <div className="text-xs text-purple-400">Install</div>
                    )}
                  </button>

                  {/* Phantom Option */}
                  <button
                    onClick={() => handleWalletSelection('phantom')}
                    className="w-full flex items-center space-x-3 p-4 bg-n-7 hover:bg-n-6 border border-n-6 rounded-lg transition duration-200"
                  >
                    <div className="text-2xl">🟣</div>
                    <div className="text-left">
                      <div className="text-white font-medium">Phantom</div>
                      <div className="text-xs text-n-4">
                        {isPhantomInstalled() ? "Solana blockchain" : "Install Phantom"}
                      </div>
                    </div>
                    {!isPhantomInstalled() && (
                      <div className="text-xs text-purple-400">Install</div>
                    )}
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={closeWalletOptions}
                  className="w-full mt-4 py-2 text-sm text-n-4 hover:text-n-2 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <button
          onClick={disconnectWallet}
          className="btn btn-outline btn-error"
        >
          Disconnect ({formatAccount(account)} - {walletType?.toUpperCase()})
        </button>
      )}
    </div>
  );
}
