import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";

// import { brainwave } from "../assets";
import { navigation } from "../../constants";
import Button from "./Button";
import MenuSvg from "../../assets/svg/MenuSvg";
import { HamburgerMenu } from "../design/Header";
import { useState } from "react";
import WalletConnectButton from "../../comp2/walletconnect";

import { useAuth } from "../../store/auth";
import { Link } from "react-router-dom";

const Header = () => {
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);
  const { loggedIn } = useAuth();

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;

    enablePageScroll();
    setOpenNavigation(false);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 bg-blue-400 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <a className="block w-[12rem] xl:mr-8" href="/">
          <img src="/VitalLogo.jpeg" width={120} height={20} alt="Vitaledge" />
        </a>

        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={handleClick}
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

            {/* Conditional rendering for logged-in or logged-out users */}
            {loggedIn ? (
              <>
                {/* For logged-in users in the hamburger menu */}
                <a
                  href="/logout"
                  onClick={handleClick}
                  className="block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold lg:leading-5 lg:hover:text-n-1 xl:px-12 lg:hidden"
                >
                  Logout
                </a>
                <div className="lg:hidden px-6 py-6 md:py-8">
                  <WalletConnectButton />
                </div>
              </>
            ) : (
              <>
                {/* For logged-out users in the hamburger menu */}
                <a
                  href="/register"
                  onClick={handleClick}
                  className="block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold lg:leading-5 lg:hover:text-n-1 xl:px-12 lg:hidden"
                >
                  Register
                </a>
                <a
                  href="/login"
                  onClick={handleClick}
                  className="block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold lg:leading-5 lg:hover:text-n-1 xl:px-12 lg:hidden"
                >
                  Login
                </a>
              </>
            )}
          </div>

          <HamburgerMenu />
        </nav>

        {/* Full-screen menu: conditional rendering based on loggedIn */}
        {loggedIn ? (
          <>
            <div className="flex items-center space-x-4 ml-auto">
              <Button className="hidden lg:flex" mr-5>
                <div>
                  <WalletConnectButton />
                </div>
              </Button>
              <Button className="hidden lg:flex" href="/logout">
                Logout
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-4 ml-auto">
              <Button className="hidden lg:flex" href="/register">
                Register
              </Button>
              <Button className="hidden lg:flex" href="/login">
                Login
              </Button>
            </div>
          </>
        )}

        <Button
          className="ml-auto lg:hidden"
          px="px-3"
          onClick={toggleNavigation}
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Header;
