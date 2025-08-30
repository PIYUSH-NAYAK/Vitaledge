import { Route, Routes, Navigate } from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";
import ContactPage from "./components/myComp/ContactUs";
import Footer from "./components/mycomp2/Footer";
import Header from "./components/mycomp2/Header";
import { Homepage } from "./components/myComp/Homepage";
import Login from "./components/Login"; // ✅ Firebase Login
import Register from "./components/Register"; // ✅ Firebase Register
import ProfileDashboard from "./components/ProfileDashboard"; // ✅ New Profile Dashboard
import AdminPage from "./components/AdminPage"; // ✅ Admin Page
import ManageStock from "./components/ManageStock"; // ✅ Stock Management
import AddMedicine from "./components/AddMedicine"; // ✅ Add medicine page
import Medicines from "./components/Medicines"; // ✅ Medicines listing
import MedicineDetails from "./components/MedicineDetails"; // ✅ Medicine details
import Cart from "./components/Cart"; // ✅ Shopping cart
import Checkout from "./components/Checkout"; // ✅ Checkout page
import OrderHistory from "./components/OrderHistory"; // ✅ Order history
import OrderDetails from "./components/OrderDetails"; // ✅ Order details
import BlockchainMedicine from "./components/BlockchainMedicine"; // ✅ Blockchain medicine
import AboutPage from "./components/myComp/Aboutus";
import Error404 from "./components/myComp/errorPage";
import Logout from "./components/myComp/Logout"; // ✅ Add Firebase Logout
import ProfileSettings from "./components/ProfileSettings"; // ✅ Profile settings
import { AuthProvider, useAuth } from "./context/AuthContext"; // ✅ Firebase Auth Context
import { CartProvider } from "./context/CartContext"; // ✅ Cart Context
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Firebase Protected Route
import AdminProtectedRoute from "./components/AdminProtectedRoute"; // ✅ Admin Protected Route
import SetPasswordModal from "./components/SetPasswordModal"; // ✅ Password setup modal
import { ToastContainer } from "react-toastify";

const AppContent = () => {
  const { user, showPasswordSetup, newGoogleUser, closePasswordSetup } = useAuth(); // ✅ Firebase auth check

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="colored"
        style={{ zIndex: 99999 }}
        enableMultiContainer={false}
        limit={3}
      />
      
      {/* Password Setup Modal for new Google users */}
      <SetPasswordModal
        isOpen={showPasswordSetup}
        onClose={closePasswordSetup}
        userEmail={newGoogleUser?.email}
        onSuccess={() => {
          console.log('Password set successfully for:', newGoogleUser?.email);
        }}
      />
      
      <div className="pt-[4.75rem] lg:pt-[5.25rem]">
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          
          {/* Public routes - redirect to home if logged in */}
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/verify-email"
            element={user ? <Navigate to="/" /> : <Register />}
          />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ProfileDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Medicines />
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
            path="/medicines"
            element={
              <ProtectedRoute>
                <Medicines />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medicines/:slug"
            element={
              <ProtectedRoute>
                <MedicineDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
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
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <ProtectedRoute>
                <OrderDetails />
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
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/add-medicine"
            element={
              <AdminProtectedRoute>
                <AddMedicine />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-stock"
            element={
              <AdminProtectedRoute>
                <ManageStock />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/blockchain"
            element={
              <ProtectedRoute>
                <BlockchainMedicine />
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
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
