import { Route, Routes, Navigate } from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";
import ContactPage from "./components/myComp/ContactUs";
import Footer from "./components/mycomp2/Footer";
import Header from "./components/mycomp2/Header";
import { Homepage } from "./components/myComp/Homepage";
import Login from "./components/Login"; // ✅ Firebase Login
import Register from "./components/Register"; // ✅ Firebase Register
import Dashboard from "./components/Dashboard"; // ✅ Firebase Dashboard
import AdminPage from "./components/AdminPage"; // ✅ Admin Page
import Products from "./comp2/Products" // ✅ Ensure correct path
import AboutPage from "./components/myComp/Aboutus";
import Error404 from "./components/myComp/errorPage";
import Checkout from "./components/myComp/Checkout";
import Bill from "./components/myComp/Bill";
import Logout from "./components/myComp/Logout"; // ✅ Add Firebase Logout
import { AuthProvider, useAuth } from "./context/AuthContext"; // ✅ Firebase Auth Context
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Firebase Protected Route
import { ToastContainer } from "react-toastify";

const AppContent = () => {
  const { user } = useAuth(); // ✅ Firebase auth check

  return (
    <>
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
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          
          {/* Public routes - redirect to dashboard if logged in */}
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" /> : <Register />}
          />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <ContactPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/aboutus"
            element={
              <ProtectedRoute>
                <AboutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bill"
            element={
              <ProtectedRoute>
                <Bill />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          
          {/* Logout route */}
          <Route path="/logout" element={<Logout />} />
          
          {/* 404 Page */}
          <Route path="*" element={<Error404 />} />
        </Routes>
        <Footer />
      </div>
      <ButtonGradient />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
