"use client"; // Required for client-side rendering
import { useState, useEffect } from "react";

export default function WalletConnectButton() {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Restore the account state from local storage on component load
  useEffect(() => {
    const savedAccount = localStorage.getItem("connectedAccount");
    if (savedAccount) {
      setAccount(savedAccount);
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        setIsConnecting(true); // Indicate connection in progress

        // Request accounts from MetaMask
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
          setAccount(accounts[0]); // Save the connected account
          localStorage.setItem("connectedAccount", accounts[0]); // Save to local storage
          console.log("Connected Account:", accounts[0]);
        }
      } catch (error) {
        if (error.code === 4001) {
          // User rejected the request
          console.warn("User rejected connection:", error);
          alert("You closed MetaMask. Please try connecting again.");
        } else {
          // Handle other errors
          console.error("Error connecting to wallet:", error);
          alert("An error occurred while connecting. Please try again.");
        }
      } finally {
        setIsConnecting(false); // Reset "Connecting" state
      }
    } else {
      // MetaMask is not installed
      alert("MetaMask is not installed. Please install it to connect your wallet.");
    }
  };

  const disconnectWallet = () => {
    setAccount(null); // Clear the account state
    localStorage.removeItem("connectedAccount"); // Remove from local storage
    console.log("Wallet disconnected");
  };

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
          disabled={isConnecting} // Disable button while connecting
          className={`btn btn-primary btn-outline ${
            isConnecting ? "bg-gray-400 cursor-not-allowed" : ""
          } text-white py-2 px-4 rounded-lg transition duration-300`}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <button
          onClick={disconnectWallet}
          className="btn btn-outline btn-error bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-300"
        >
          Disconnect ({formatAccount(account)})
        </button>
      )}
    </div>
  );
}
