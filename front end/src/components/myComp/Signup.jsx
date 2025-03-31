import { useState } from "react";
import { Link } from "react-router-dom";
import InputControls from "../../comp2/Inputcontrols";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import Section from "../mycomp2/Section";

const URI = `${import.meta.env.VITE_APP_BACKEND_URL}/register`;

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to control password visibility
  const nav = useNavigate();

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
  
    const signupData = { name, email, password, confirmPassword };
  
    try {
      const response = await fetch(URI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });
      const data = await response.json();
  
      if (response.ok) {
        toast.dismiss();  // Dismiss any existing toasts
        setTimeout(() => {
          toast.success("Signup successful! Redirecting...");
        }, 100); // Delay the toast by 100ms        
        nav("/login");
  
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        if (data.message) {
          const lowerCaseMsg = data.message.toLowerCase();
          
          if (lowerCaseMsg.includes("email")) {
            toast.error(data.message || data.error);
          } else if (lowerCaseMsg.includes("password")) {
            toast.error(data.message || data.error);
          } else if (lowerCaseMsg.includes("name")) {
            toast.error(data.message || data.error);
          } else {
            toast.error(data.message || data.error);
          }
        } else {
          toast.error(data.message || data.error);
        }
      }
    } catch (error) {
      toast.error("Registration Failed");
    }
  };

  return (
    <Section className="pt-[4rem] -mt-[5.25rem]" crosses>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-screen space-y-8 bg-gray-900 p-10 rounded-xl shadow-md">
          <h2 className="text-center text-3xl font-extrabold text-white">Sign Up</h2>
          <p className="mt-2 text-center text-sm text-gray-400">Create your account</p>
          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            <InputControls
              label="Name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputControls
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <InputControls
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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
            <div className="relative">
              <InputControls
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              className="w-full py-2 px-4 bg-teal-600 text-white rounded-md"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-500 hover:text-teal-400">
              Login
            </Link>
          </p>
        </div>
      </div>
    </Section>
  );
};

export default SignupForm;