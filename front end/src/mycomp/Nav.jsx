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
    <div className="flex items-center justify-center bg-blue-500 w-full">
  <div className="navbar w-auto text-black fixed z-50 rounded-2xl mt-28 backdrop-blur-2xl ">
    <div className="navbar-start">
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
              <WalletConnectButton />
            </div>
          </ul>
        )}
      </div>
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Vitaledge
        </Link>
      </div>
    </div>
    <div className="flex-none pl-20">
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
      <div className="form-control hidden sm:block pr-5">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-auto bg-gray-200"
        />
      </div>
      <div className="justify-end flex mr-5">
        <div className="hidden lg:block mr-5">
          <WalletConnectButton />
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
