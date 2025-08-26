import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // ✅ Updated to Firebase auth
import { navigation } from "../../constants";
import Button from "./Button";
import MenuSvg from "../../assets/svg/MenuSvg";
import WalletConnectButton from "../common/walletconnect";

const Header = () => {
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth(); // ✅ Updated to use Firebase user

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

  const loggedIn = !!user; // ✅ Derive loggedIn from user existence

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
              {navigation
                .filter(item => !item.adminOnly || (item.adminOnly && isAdmin))
                .map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  className={`block relative font-code text-4xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                    item.onlyMobile ? "lg:hidden" : ""
                  } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-base lg:font-semibold ${
                    item.url === pathname.hash
                      ? "z-2 lg:text-n-1"
                      : "lg:text-n-1/50"
                  } lg:leading-5 lg:hover:text-n-1 xl:px-4 lg:px-3`}
                >
                  {item.title}
                </a>
              ))}

              {/* ✅ Auth Buttons inside Hamburger Menu */}
              {loggedIn ? (
                <>
                <Button className="mt-4 lg:hidden">
                    <WalletConnectButton />
                  </Button>
                  <Button className="mt-4 lg:hidden" href="/logout">
                    Logout
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

          {/* ✅ Auth Buttons + Wallet for Desktop */}
          <div className="flex items-center space-x-10 ml-auto">
            {/* ✅ Authenticated User */}
            {loggedIn ? (
              <>
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
    </>
  );
};

export default Header;
