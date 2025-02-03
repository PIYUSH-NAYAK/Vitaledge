import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";
import { CartProvider } from "./context/cart2.jsx";
import { AuthProvider } from "./store/auth.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
  <React.StrictMode>
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
  </React.StrictMode>
    </AuthProvider>
);
