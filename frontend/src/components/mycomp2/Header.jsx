import { useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { navigation } from "../../constants";
import Button from "./Button";
import MenuSvg from "../../assets/svg/MenuSvg";
import WalletConnectButton from "../common/walletconnect";
import { FaShoppingCart, FaUser, FaSignOutAlt, FaTachometerAlt, FaCog } from "react-icons/fa";

const Header = () => {
  const pathname = useLocation();
  const navigate = useNavigate();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { cartCount } = useCart(); // Use cart context
  const { user, logout } = useAuth();

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          setIsAdmin(!!idTokenResult.claims.admin);
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const loggedIn = !!user;

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowProfileDropdown(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-50 bg-blue-400 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
          openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
        }`}
      >
        <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
          {/* Logo Section */}
          <a className="block w-[12rem] xl:mr-8" href="/">
            <img
              src="/VitalLogo.jpeg"
              width={120}
              height={20}
              alt="Vitaledge"
            />
          </a>

          {/* Mobile Hamburger Menu */}
          <nav
            className={`${
              openNavigation ? "flex" : "hidden"
            } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent flex-col lg:flex-row overflow-y-auto`}
          >
            <div className="relative z-2 flex flex-col items-center justify-start m-auto lg:flex-row pt-8 lg:pt-0 max-h-screen overflow-y-auto">
              {navigation
                .filter(item => !item.adminOnly || (item.adminOnly && isAdmin))
                .map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  className={`block relative font-code text-2xl lg:text-base uppercase text-n-1 transition-colors hover:text-color-1 ${
                    item.onlyMobile ? "lg:hidden" : ""
                  } px-6 py-4 lg:py-6 lg:-mr-0.25 lg:font-semibold ${
                    item.url === pathname.hash
                      ? "z-2 lg:text-n-1"
                      : "lg:text-n-1/50"
                  } lg:leading-5 lg:hover:text-n-1 xl:px-4 lg:px-3`}
                >
                  {item.title}
                </a>
              ))}

              {/* Mobile Auth Buttons */}
              {loggedIn ? (
                <div className="flex flex-col items-center space-y-4 mt-8 lg:hidden">
                  <div className="w-full max-w-xs">
                    <WalletConnectButton />
                  </div>
                  <Button 
                    className="w-full max-w-xs" 
                    onClick={() => navigate('/dashboard')}
                  >
                    <FaTachometerAlt className="mr-2" />
                    Dashboard
                  </Button>
                  <Button className="w-full max-w-xs" onClick={handleLogout}>
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4 mt-8 lg:hidden">
                  <Button className="w-full max-w-xs" href="/register">
                    Register
                  </Button>
                  <Button className="w-full max-w-xs" href="/login">
                    Login
                  </Button>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Right Section */}
          <div className="flex items-center space-x-4 ml-auto">
            {loggedIn ? (
              <>
                {/* Cart Icon */}
                <button
                  onClick={() => navigate('/cart')}
                  className="relative p-2 text-n-1 hover:text-color-1 transition-colors hidden lg:block"
                >
                  <FaShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown */}
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-2 p-2 text-n-1 hover:text-color-1 transition-colors"
                  >
                    <FaUser size={18} />
                    <span className="text-sm">{user.displayName || user.email}</span>
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-n-8 border border-n-6 rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-n-6">
                        <p className="text-sm text-n-2">{user.displayName || 'User'}</p>
                        <p className="text-xs text-n-4">{user.email}</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          navigate('/dashboard');
                          setShowProfileDropdown(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-n-1 hover:bg-n-7 transition-colors"
                      >
                        <FaTachometerAlt className="mr-3" />
                        Profile Dashboard
                      </button>

                      <button
                        onClick={() => {
                          navigate('/settings');
                          setShowProfileDropdown(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-n-1 hover:bg-n-7 transition-colors"
                      >
                        <FaCog className="mr-3" />
                        Settings
                      </button>

                      <div className="px-4 py-2">
                        <WalletConnectButton />
                      </div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-n-1 hover:bg-n-7 transition-colors border-t border-n-6"
                      >
                        <FaSignOutAlt className="mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button className="hidden lg:flex" href="/register">
                  Register
                </Button>
                <Button className="hidden lg:flex" href="/login">
                  Login
                </Button>
              </>
            )}

            {/* Mobile Cart Icon */}
            {loggedIn && (
              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 text-n-1 hover:text-color-1 transition-colors lg:hidden"
              >
                <FaShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Hamburger Menu Button */}
            <Button
              className="ml-2 lg:hidden"
              px="px-3"
              onClick={toggleNavigation}
            >
              <MenuSvg openNavigation={openNavigation} />
            </Button>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showProfileDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileDropdown(false)}
        />
      )}
    </>
  );
};

export default Header;
