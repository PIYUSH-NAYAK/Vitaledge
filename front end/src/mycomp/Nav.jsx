import  { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

// import './Nav.css'
import WalletConnectButton from "../../mycomp2/WalletConnect";

const Nav2 = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="navbar w-auto  bg-teal-50 text-black  fixed z-50  rounded-2xl  mt-28">
        <div className="navbar-start ">
          <div className="dropdown relative" ref={dropdownRef}>
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden"
              onClick={toggleDropdown}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            {isDropdownOpen && (
              <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-teal-50 rounded-box w-52">
                {/* <li>
                  <div className="mt-3">
                    <a href="#equi" >Home</a>
                  </div>
                </li>
                <li>
                  <div className="mt-3">
                    <a href="#ens">Services</a>
                  </div>
                </li> */}
                {/* <li>
                  <div className="mt-3">
                    <a href="#sug">About Us </a>
                  </div>
                </li> */}
                <div>
                  <Link to="/">
                    <button className="btn btn-ghost">Home</button>
                  </Link>
                </div>
                <div>
                  <Link to="/Services">
                    <button className="btn btn-ghost">Services</button>
                  </Link>
                </div>
                <div>
                  <Link to="/AboutUs">
                    <button className="btn btn-ghost">About us</button>
                  </Link>
                </div>
                <div>
                  <Link to="/ContactUs">
                    <button className="btn btn-ghost">Contact us</button>
                  </Link>
                </div>
                <div>
                    <WalletConnectButton/>
                </div>
              
              </ul>
            )}
          </div>
          {/* <div className="w-10 rounded-full overflow-hidden">
            <img
              alt="Tailwind CSS Navbar component"
              src="/LOGO1.png" // Ensure this path is correct
              width={40} // Width of the image in pixels
              height={40} // Height of the image in pixels
            />
          </div> */}
          <div className="flex-1 ">
            <a href="#" className="btn btn-ghost text-xl">
              Vitaledge
            </a>
          </div>
        </div>
        {/* <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 font-bold">
            <li>
              <div>
                <a href="#equi">Home</a>
              </div>
            </li>
            <li>
              <div>
              <a href="/Services">
              <button className="btn btn-ghost">Services</button>
            </a>
                 <a href="#ens">Services</a> 
              </div>
            </li>
            <li>
              <div className="hidden xl:block">
                <a href="#sug">Suggestion Box</a>
              </div>
            </li> 
          </ul>
        </div> */}
        
        <div className="flex-none  pl-20 ">
          <div className="hidden lg:block">
            <Link to="/">
              <button className="btn btn-ghost">Home</button>
            </Link>
          </div>
          <div className="hidden lg:block">
            <Link to="/Services">
              <button className="btn btn-ghost">Services</button>
            </Link>
          </div>
          <div className="hidden lg:block">
            <Link to="/AboutUs">
              <button className="btn btn-ghost">About us</button>
            </Link>
          </div>
          <div className="hidden lg:block">
            <Link to="/ContactUs">
              <button className="btn btn-ghost">Contact us</button>
            </Link>
          </div>
         
          
          <div className="form-control hidden sm:block pr-5 ">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto bg-gray-200"
            />
          </div>
          {/* <div className="pl-2">
            <button className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="badge badge-xs badge-primary indicator-item"></span>
              </div>
            </button>
          </div> */}
          {/* <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <a href="/">
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </a>
            </div>
          </div> */}

          <div className="justify-end flex mr-5">
          <div className="hidden lg:block mr-5">
            <WalletConnectButton/>
          </div>
            <a href="/LoginPage">
              <button className="btn btn-outline btn-primary">Login</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav2;
