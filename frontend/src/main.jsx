import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import WalletConnectionProvider from "./components/WalletProvider";

import App from "./App.jsx";
import "./index.css";
// Firebase AuthProvider is now handled inside App.jsx

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <WalletConnectionProvider>
        <App />
      </WalletConnectionProvider>
    </BrowserRouter>
  </React.StrictMode>
);
