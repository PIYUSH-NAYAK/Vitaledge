"use client";
import { useState, useEffect, useContext } from "react";
import { CartContext } from "../../context/cart2.jsx";
import { toast ,ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as solanaWeb3 from "@solana/web3.js";
import { Buffer } from "buffer";
import Section from "../mycomp2/Section.jsx";

// ✅ Polyfill Buffer for Browser
if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

export default function Checkout() {
  const { cartItems, clearCart, getCartTotal } = useContext(CartContext);

  const [walletAddress, setWalletAddress] = useState(null);
  const [walletType, setWalletType] = useState(null);
  const [solPrice, setSolPrice] = useState(0);
  const [phantomProvider, setPhantomProvider] = useState(null);

  // ✅ Fetch wallet address and type from localStorage
  useEffect(() => {
    const savedAccount = localStorage.getItem("connectedAccount");
    const savedWalletType = localStorage.getItem("walletType");

    if (savedAccount && savedWalletType) {
      setWalletAddress(savedAccount);
      setWalletType(savedWalletType);
    } else {
      toast.error("❌ No connected wallet found. Please connect your wallet.");
    }

    // ✅ Detect Phantom Wallet
    if (window.solana && window.solana.isPhantom) {
      setPhantomProvider(window.solana);
    } else {
      toast.error("❌ Phantom Wallet not found. Please install it.");
    }

    // ✅ Fetch real-time SOL price to convert INR to SOL
    fetchSolPrice();
  }, []);

  // ✅ Fetch real-time Solana price from CoinGecko API
  const fetchSolPrice = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=inr"
      );
      const data = await response.json();
      setSolPrice(data.solana.inr);
    } catch (error) {
      console.error("❌ Error fetching SOL price:", error);
    }
  };

  // ✅ Calculate total price in SOL
  const calculateTotalInSol = () => {
    const totalInInr = getCartTotal();
    return (totalInInr / solPrice).toFixed(6);
  };

  // ✅ Connect to Phantom Wallet
  const connectPhantomWallet = async () => {
    if (!phantomProvider) {
      toast.error("❌ Phantom Wallet not found. Please install it.");
      return;
    }

    try {
      const response = await phantomProvider.connect();
      setWalletAddress(response.publicKey.toString());
      localStorage.setItem("connectedAccount", response.publicKey.toString());
      localStorage.setItem("walletType", "phantom");
      toast.success("✅ Phantom Wallet connected successfully!");
    } catch (error) {
      console.error("❌ Error connecting to Phantom:", error);
      toast.error("❌ Connection to Phantom failed!");
    }
  };

  // ✅ Handle Payment with Phantom Wallet
  const handlePayment = async () => {
    if (!walletAddress || walletType !== "phantom") {
      toast.error("❌ Please connect to Phantom Wallet for payment.");
      return;
    }

    const amountInSol = calculateTotalInSol();
    const recipient = "5MUakabnwfLiN7vxD1p1XLwbBZML3Dpy8JecGcT7KvvL";

    try {
      if (phantomProvider && walletAddress) {
        const connection = new solanaWeb3.Connection(
          "https://api.devnet.solana.com" // Use "https://api.mainnet-beta.solana.com" for production
        );

        const transaction = new solanaWeb3.Transaction().add(
          solanaWeb3.SystemProgram.transfer({
            fromPubkey: new solanaWeb3.PublicKey(walletAddress),
            toPubkey: new solanaWeb3.PublicKey(recipient),
            lamports: parseFloat(amountInSol) * solanaWeb3.LAMPORTS_PER_SOL,
          })
        );

        // ✅ Get latest blockhash
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = new solanaWeb3.PublicKey(walletAddress);

        // ✅ Sign and send the transaction
        // ✅ Sign and send the transaction
        const signedTransaction = await phantomProvider.signTransaction(
          transaction
        );
        const signature = await connection.sendRawTransaction(
          signedTransaction.serialize()
        );
        await connection.confirmTransaction(signature, "confirmed");

        // ✅ Save Transaction Data in Local Storage
        const transactionDetails = {
          signature,
          amountInSol: amountInSol,
          amountInInr: getCartTotal().toFixed(2),
          recipient,
          items: cartItems,
          date: new Date().toLocaleString(),
        };

        localStorage.setItem(
          "transactionDetails",
          JSON.stringify(transactionDetails)
        );

        // ✅ Payment successful message
        console.log("✅ Transaction Successful:", signature);
        toast.success(`✅ Payment of ${amountInSol} SOL successful!`);
        clearCart(); // Clear cart after payment

        // ✅ Redirect to the Bill Page After Payment
        setTimeout(() => {
          window.location.href = "/bill"; // Redirect to the bill page
        }, 3000);
      } else {
        toast.error(
          "❌ Phantom Wallet not found. Please install and try again."
        );
      }
    } catch (error) {
      console.error("❌ Payment Error:", error);
      toast.error("❌ Payment failed. Please try again.");
    }
  };

  // ✅ Handle Order Placement (Fallback without Phantom)
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      toast.error("❌ Cart is empty! Add items to proceed.");
      return;
    }

    toast.success("✅ Order placed successfully!");
    clearCart(); // Clear cart after placing the order
    setTimeout(() => {
      window.location.href = "/"; // Redirect to home page after order
    }, 2000);
  };

  return (
    <Section
    className="pt-[4rem] -mt-[5.25rem]"
    crosses
    crossesOffset="lg:translate-y-[5.25rem]"
    customPaddings
    id="hero"
  >
    {/* ✅ Toast Container for Notifications */}
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-black p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Checkout
      </h1>

      {/* ✅ Show Connected Wallet */}
      {walletAddress ? (
        <div className="bg-gray-800 text-white p-4 rounded-lg mb-6">
          <h2 className="text-lg">
            ✅ Connected with {walletType?.toUpperCase()}:
          </h2>
          <p className="font-mono text-sm">{walletAddress}</p>
        </div>
      ) : (
        <button
          onClick={connectPhantomWallet}
          className="px-4 py-2 bg-purple-600 text-white text-sm font-bold uppercase rounded hover:bg-purple-700"
        >
          Connect Phantom Wallet
        </button>
      )}

      {/* ✅ Table Container */}
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="px-6 py-3 text-left uppercase font-bold">Image</th>
              <th className="px-6 py-3 text-left uppercase font-bold">Name</th>
              <th className="px-6 py-3 text-center uppercase font-bold">
                Quantity
              </th>
              <th className="px-6 py-3 text-center uppercase font-bold">
                Price
              </th>
              <th className="px-6 py-3 text-center uppercase font-bold">
                Total Price
              </th>
            </tr>
          </thead>

          <tbody className="text-gray-700 dark:text-gray-300">
            {cartItems.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {/* ✅ Product Image */}
                <td className="px-6 py-4">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 rounded-md"
                  />
                </td>

                {/* ✅ Product Name */}
                <td className="px-6 py-4 font-medium">{item.title}</td>

                {/* ✅ Quantity */}
                <td className="px-6 py-4 text-center">{item.quantity}</td>

                {/* ✅ Price (per item) */}
                <td className="px-6 py-4 text-center">₹{item.price}</td>

                {/* ✅ Total Price for item */}
                <td className="px-6 py-4 text-center">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Grand Total and Payment Options */}
      {cartItems.length > 0 ? (
        <div className="w-full max-w-4xl mt-8 p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              Grand Total:
            </h2>
            <p className="text-xl font-bold text-green-500">
              ₹{getCartTotal().toFixed(2)} (~ {calculateTotalInSol()} SOL)
            </p>
          </div>

          {/* ✅ Pay with Phantom Button */}
          {walletType === "phantom" ? (
            <button
              onClick={handlePayment}
              className="w-full px-4 py-3 bg-blue-600 text-white text-lg font-bold uppercase rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
            >
              Pay with Phantom ({calculateTotalInSol()} SOL)
            </button>
          ) : (
            <button
              onClick={handlePlaceOrder}
              className="w-full px-4 py-3 bg-green-600 text-white text-lg font-bold uppercase rounded hover:bg-green-700 focus:outline-none focus:bg-green-700"
            >
              Place Order (No Wallet)
            </button>
          )}
        </div>
      ) : (
        <div className="text-center mt-10">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            No items in the cart!
          </h2>
          <button
            onClick={() => (window.location.href = "/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-bold uppercase rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          >
            Go Back to Shop
          </button>
        </div>
      )}
    </div>
    </Section>
  );
}
