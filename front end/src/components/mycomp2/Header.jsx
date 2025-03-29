import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { useContext, useState } from "react";
import { CartContext } from "../../context/cart2.jsx"; // ✅ Cart context
import { useAuth } from "../../store/auth";
import { navigation } from "../../constants";
import Button from "./Button";
import MenuSvg from "../../assets/svg/MenuSvg";
import { HamburgerMenu } from "../design/Header";
import WalletConnectButton from "../../comp2/walletconnect";
import { Link } from "react-router-dom";
import Cart from "../../comp2/Cart";
import { FaShoppingCart } from "react-icons/fa"; // ✅ Import Cart Icon

const Header = () => {
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { loggedIn } = useAuth();
  const { cartItems } = useContext(CartContext); // ✅ Cart items from context

  // ✅ Toggle navigation menu
  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  // ✅ Toggle Cart Modal
  const toggleCartModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-50 bg-blue-400 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
          openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
        }`}
      >
        <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
          {/* ✅ Logo Section */}
          <a className="block w-[12rem] xl:mr-8" href="/">
            <img
              src="/VitalLogo.jpeg"
              width={120}
              height={20}
              alt="Vitaledge"
            />
          </a>

          {/* ✅ Navigation Menu + Auth Buttons */}
          <nav
            className={`${
              openNavigation ? "flex" : "hidden"
            } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent flex-col lg:flex-row`}
          >
            <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
              {navigation.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                    item.onlyMobile ? "lg:hidden" : ""
                  } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                    item.url === pathname.hash
                      ? "z-2 lg:text-n-1"
                      : "lg:text-n-1/50"
                  } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
                >
                  {item.title}
                </a>
              ))}

              {/* ✅ Auth Buttons inside Hamburger Menu */}
              {loggedIn ? (
                <>
                  <Button className="mt-4 lg:hidden" href="/logout">
                    Logout
                  </Button>
                  <Button className="mt-4 lg:hidden">
                    <WalletConnectButton />
                  </Button>
                </>
              ) : (
                <>
                  <Button className="mt-4 lg:hidden" href="/register">
                    Register
                  </Button>
                  <Button className="mt-4 lg:hidden" href="/login">
                    Login
                  </Button>
                </>
              )}
            </div>
          </nav>

          {/* ✅ Auth Buttons + Cart Icon for Desktop */}
          <div className="flex items-center space-x-10 ml-auto">
            {/* ✅ Authenticated User */}
            {loggedIn ? (
              <>
                {/* ✅ Cart Icon (Visible only when logged in) */}
                <div
                  className="relative cursor-pointer"
                  onClick={toggleCartModal}
                >
                  <FaShoppingCart className="text-2xl text-white hover:text-color-1" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </div>

                <Button className="hidden lg:flex">
                  <WalletConnectButton />
                </Button>
                <Button className="hidden lg:flex" href="/logout">
                  Logout
                </Button>
              </>
            ) : (
              <>
                {/* ✅ Show Login/Register for Non-authenticated Users */}
                <Button className="hidden lg:flex" href="/register">
                  Register
                </Button>
                <Button className="hidden lg:flex" href="/login">
                  Login
                </Button>
              </>
            )}

            {/* ✅ Hamburger Menu */}
            <Button
              className="ml-auto lg:hidden"
              px="px-3"
              onClick={toggleNavigation}
            >
              <MenuSvg openNavigation={openNavigation} />
            </Button>
          </div>
        </div>
      </div>

      {/* ✅ Global Cart Modal with z-50 */}
      <div className={`fixed inset-0 z-50 ${showModal ? "block" : "hidden"}`}>
        <Cart showModal={showModal} toggle={toggleCartModal} />
      </div>
    </>
  );
};

export default Header;
