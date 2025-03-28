"use client";
import { useState, useEffect } from "react";

export default function WalletConnectButton() {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletType, setWalletType] = useState(null); // MetaMask or Phantom

  // ✅ Restore the account from local storage
  useEffect(() => {
    const savedAccount = localStorage.getItem("connectedAccount");
    const savedWalletType = localStorage.getItem("walletType");
    if (savedAccount && savedWalletType) {
      setAccount(savedAccount);
      setWalletType(savedWalletType);
    }
  }, []);

  // ✅ Detect and Connect Wallet
  const connectWallet = async () => {
    if (typeof window !== "undefined") {
      // ✅ Check if Phantom is available
      if (window.solana && window.solana.isPhantom) {
        try {
          setIsConnecting(true);

          // Connect to Phantom Wallet
          const response = await window.solana.connect();
          const phantomAddress = response.publicKey.toString();

          setAccount(phantomAddress);
          setWalletType("phantom");
          localStorage.setItem("connectedAccount", phantomAddress);
          localStorage.setItem("walletType", "phantom");

          console.log("✅ Connected to Phantom:", phantomAddress);
          return;
        } catch (error) {
          console.error("❌ Error connecting to Phantom:", error);
        }
      }

      // ✅ Check if MetaMask is available
      if (window.ethereum) {
        try {
          setIsConnecting(true);

          // Request MetaMask accounts
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });

          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setWalletType("metamask");
            localStorage.setItem("connectedAccount", accounts[0]);
            localStorage.setItem("walletType", "metamask");

            console.log("✅ Connected to MetaMask:", accounts[0]);
          }
        } catch (error) {
          console.error("❌ Error connecting to MetaMask:", error);
        }
      } else {
        alert("❗ No compatible wallet found. Install MetaMask or Phantom.");
      }
    }
    setIsConnecting(false);
  };

  // ✅ Disconnect Wallet and Clear Data
  const disconnectWallet = () => {
    setAccount(null);
    setWalletType(null);
    localStorage.removeItem("connectedAccount");
    localStorage.removeItem("walletType");
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
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className={`btn btn-primary btn-outline ${
            isConnecting ? "bg-gray-400 cursor-not-allowed" : ""
          } text-white py-2 px-4 rounded-lg transition duration-300`}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
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
