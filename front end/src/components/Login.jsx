import { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation after successful login
import InputControls from "../comp2/Inputcontrols";
import {useAuth} from "../store/auth";


const URI = "http://localhost:7777/login";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMsg] = useState("");
  const nav = useNavigate();


  const {storeToken} = useAuth();
  // const { storeToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = { email, password };

    try {
      const response = await fetch(URI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        storeToken(data.token);

        setEmail("");
        setPassword("");
        setErrorMsg("");
        // nav('/'); 
        

         
        nav('/');
      } else {
        const errorMsg = data.message || data.msg || "Login failed";
        setErrorMsg(errorMsg);
        console.error("Error:", errorMsg);
      }
    } catch (error) {
      console.error("Login Failed:", error);
      setErrorMsg("A network error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative z-1 p-1 rounded-2xl bg-conic-gradient">
        <div className="max-w-md w-full space-y-8 bg-gray-900 p-10 rounded-xl shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">Login</h2>
            <p className="mt-2 text-sm text-gray-400">
              Enter your email below to login to your account.
            </p>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm text-center">{errorMessage}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputControls
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputControls
              label="Password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 transition"
            >
              Login
            </button>
          </form>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => console.log("Login with Google")}
              className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-800 hover:bg-gray-700 transition"
            >
              Login with Google
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don&#39;t have an account?{" "}
              <a href="/register" className="font-medium text-teal-500 hover:text-teal-400">
                Sign up
              </a>
            </p>
            <a href="/forgot-password" className="text-sm text-teal-500 hover:text-teal-400 underline">
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
