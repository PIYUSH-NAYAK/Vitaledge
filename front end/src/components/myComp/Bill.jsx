"use client";
import { useEffect, useState } from "react";

const Bill = () => {
  const [transaction, setTransaction] = useState(null);

  // ✅ Fetch Transaction Details from Local Storage
  useEffect(() => {
    const storedTransaction = localStorage.getItem("transactionDetails");
    if (storedTransaction) {
      setTransaction(JSON.parse(storedTransaction));
    }
  }, []);

  if (!transaction) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          No transaction found! 😔
        </h2>
      </div>
    );
  }

  const { signature, amountInSol, amountInInr, recipient, items, date } =
    transaction;

  // ✅ Generate and Download Receipt as TXT
  const downloadReceipt = () => {
    const content = `
🧾 Payment Receipt
------------------------------
Transaction ID: ${signature}
Payment Date: ${date}
Recipient: ${recipient}
Amount Paid: ${amountInSol} SOL (~₹${amountInInr})

📦 Order Summary:
${items
  .map(
    (item) =>
      `- ${item.title} (x${item.quantity}): ₹${(
        item.price * item.quantity
      ).toFixed(2)}`
  )
  .join("\n")}

💰 Grand Total: ₹${amountInInr} (~${amountInSol} SOL)
------------------------------
Thank you for shopping with us! 😊
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Receipt_${date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black flex items-center justify-center p-8">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          🧾 Payment Receipt
        </h1>

        {/* ✅ Transaction Details */}
        <div className="mb-4">
          <p className="text-gray-700 dark:text-gray-200 break-all max-w-full">
            <strong>Transaction ID:</strong>{" "}
            <a
              href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline break-all"
            >
              {signature}
            </a>
          </p>

          <p className="text-gray-700 dark:text-gray-200">
            <strong>Recipient:</strong> {recipient}
          </p>
          <p className="text-gray-700 dark:text-gray-200">
            <strong>Payment Date:</strong> {date}
          </p>
          <p className="text-gray-700 dark:text-gray-200">
            <strong>Amount Paid:</strong> {amountInSol} SOL (~₹{amountInInr})
          </p>
        </div>

        {/* ✅ Ordered Items */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            📦 Order Summary
          </h2>
          <table className="w-full table-auto text-left border-collapse">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-6 py-3">Item</th>
                <th className="px-6 py-3">Qty</th>
                <th className="px-6 py-3">Price (₹)</th>
                <th className="px-6 py-3">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              {items.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4">{item.title}</td>
                  <td className="px-6 py-4 text-center">{item.quantity}</td>
                  <td className="px-6 py-4 text-center">₹{item.price}</td>
                  <td className="px-6 py-4 text-center">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Grand Total */}
        <div className="mt-6 text-right">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Grand Total: ₹{amountInInr} (~{amountInSol} SOL)
          </h2>
        </div>

        {/* ✅ Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          {/* 🔽 Download Button */}
          <button
            onClick={downloadReceipt}
            className="px-6 py-3 bg-green-600 text-white text-lg font-bold uppercase rounded hover:bg-green-700"
          >
            ⬇️ Download Receipt
          </button>

          {/* 🏠 Back to Home Button */}
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 bg-blue-600 text-white text-lg font-bold uppercase rounded hover:bg-blue-700"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bill;
