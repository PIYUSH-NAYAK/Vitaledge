import { Route, Routes, Navigate } from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";
import ContactPage from "./components/myComp/ContactUs";
import Footer from "./components/mycomp2/Footer";
import Header from "./components/mycomp2/Header";
import { Homepage } from "./components/myComp/Homepage";
import Login from "./components/myComp/Login";
import Products from "./comp2/Products";  // ✅ Ensure correct path
import AboutPage from "./components/myComp/Aboutus";
import SignupForm from "./components/myComp/Signup";
import Error404 from "./components/myComp/errorPage";
import Logout from "./components/myComp/Logout";
import Checkout from "./components/myComp/Checkout";
import Bill from "./components/myComp/Bill";
import { useAuth } from "./store/auth";  // ✅ Fixed import

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const { loggedIn } = useAuth();
  return loggedIn ? element : <Navigate to="/login" />;
};

const App = () => {
  const { loggedIn } = useAuth();  // ✅ Centralized auth check

  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Prevent logged-in users from accessing login */}
          <Route path="/login" element={loggedIn ? <Navigate to="/" /> : <Login />} />
          
          <Route path="/register" element={loggedIn ? <Navigate to="/" /> :<SignupForm />} />
          <Route path="/products" element={<Products />} />
          <Route path="/aboutus" element={<AboutPage />} />
          
          {/* Protected Routes */}
          <Route path="/logout" element={<ProtectedRoute element={<Logout />} />} />
          <Route path="/checkout" element={<ProtectedRoute element={<Checkout />} />} />
          <Route path="/bill" element={<ProtectedRoute element={<Bill />} />} />
          
          {/* 404 Page */}
          <Route path="*" element={<Error404 />} />
        </Routes>
        <Footer />
      </div>
      <ButtonGradient />
    </>
  );
};

export default App;
