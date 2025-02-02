import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputControls from "../comp2/Inputcontrols";
const Login = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative z-1 p-1   rounded-2xl bg-conic-gradient">
        <div className="max-w-md w-full space-y-8 bg-gray-900 p-10 rounded-xl shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">Login</h2>
            <p className="mt-2 text-sm text-gray-400">
              Enter your email below to login to your account.
            </p>
          </div>
          <div className="space-y-4">
            <InputControls label="Email" placeholder="Enter your email" />
            <InputControls
              label="Password"
              placeholder="Enter your password"
              type="password"
            />
          </div>
          <div className="flex flex-col items-center mt-4">
            <Link
              to="/dashboard"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
            >
              Login
            </Link>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => console.log("Login with Google")}
              className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
            >
              Login with Google
            </button>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don&#39;t have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-teal-500 hover:text-teal-400"
              >
                Sign up
              </Link>
            </p>
            <Link
              to="/forgot-password"
              className="text-sm text-teal-500 hover:text-teal-400 underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
