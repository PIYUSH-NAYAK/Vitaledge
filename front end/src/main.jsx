import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";
import { CartProvider } from "./context/cart2.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <CartProvider>
    <React.StrictMode>
    {/* <Router> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* </Router> */}
  </React.StrictMode>

  </CartProvider>
  
);
