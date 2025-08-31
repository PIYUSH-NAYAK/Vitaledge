import { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation after successful login
import InputControls from "../common/Inputcontrols";
import { useAuth } from "../../store/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles for Toastify
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import Section from "../mycomp2/Section";

const URI = `${import.meta.env.VITE_APP_BACKEND_URL}/login`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to control password visibility
  const nav = useNavigate();
  const { storeToken } = useAuth();

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
        toast.success(data.message || "Login successful! Redirecting...");
        setTimeout(() => {
          storeToken(data.token);
          setEmail("");
          setPassword("");
        }, 1000);
        setTimeout(() => nav("/"), 2000); // Navigate after showing toast
      } else {
        const errorMsg = data.message || data.msg || "Login failed";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Login Failed:", error);
      toast.error("A network error occurred. Please try again later.");
    }
  };

  return (
    <Section className="pt-[6rem] -mt-[12rem]" crosses>
      
      <div className="min-h-screen  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="relative z-1 p-1 rounded-2xl bg-conic-gradient">
          <div className="max-w-md w-auto space-y-8 bg-gray-900 p-16 rounded-xl shadow-md">
            <div className="text-center pt-2 space-y-5">
              <h2 className="text-4xl font-extrabold -mt-[2rem] text-white">Login</h2>
              <p className="mt-2 text-sm text-gray-400">
                Enter your email below to login to your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <InputControls
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="relative">
                <InputControls
                  label="Password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-10 text-gray-400"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 transition"
              >
                Login
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don&#39;t have an account?{" "}
                <a href="/register" className="font-medium text-teal-500 hover:text-teal-400">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Login;