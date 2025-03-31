import { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation after successful login
import InputControls from "../../comp2/Inputcontrols";
import { useAuth } from "../../store/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles for Toastify
<<<<<<< HEAD
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
=======
>>>>>>> 435766c2d350d58a56e714c8f6feca6f58eb1d71
import Section from "../mycomp2/Section";

const URI = `${import.meta.env.VITE_APP_BACKEND_URL}/login`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
<<<<<<< HEAD
  const [showPassword, setShowPassword] = useState(false); // State to control password visibility
=======
  // const [errorMessage, setErrorMsg] = useState("");
>>>>>>> 435766c2d350d58a56e714c8f6feca6f58eb1d71
  const nav = useNavigate();
  const { storeToken } = useAuth();

<<<<<<< HEAD
  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
=======
  const { storeToken } = useAuth();
>>>>>>> 435766c2d350d58a56e714c8f6feca6f58eb1d71

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
<<<<<<< HEAD
        toast.success(data.message || "Login successful! Redirecting...");
=======
        console.log("login successful");
        console.log(data);
        toast.success(data.message || "Login successful! Redirecting...");

>>>>>>> 435766c2d350d58a56e714c8f6feca6f58eb1d71
        setTimeout(() => {
          storeToken(data.token);
          setEmail("");
          setPassword("");
<<<<<<< HEAD
        }, 1000);
        setTimeout(() => nav("/"), 2000); // Navigate after showing toast
      } else {
        const errorMsg = data.message || data.msg || "Login failed";
=======
        }, 1000); 
        // setErrorMsg("");
        
        setTimeout(() => nav("/"), 2000); // Navigate after showing toast
      } else {
        const errorMsg = data.message || data.msg || "Login failed";
        // setErrorMsg(errorMsg);
>>>>>>> 435766c2d350d58a56e714c8f6feca6f58eb1d71
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Login Failed:", error);
<<<<<<< HEAD
=======
      // setErrorMsg("A network error occurred. Please try again later.");
>>>>>>> 435766c2d350d58a56e714c8f6feca6f58eb1d71
      toast.error("A network error occurred. Please try again later.");
    }
  };

  return (
<<<<<<< HEAD
    <Section className="pt-[4rem] -mt-[5.25rem]" crosses>
      <ToastContainer
=======
    <Section
      className="pt-[4rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
       <ToastContainer
>>>>>>> 435766c2d350d58a56e714c8f6feca6f58eb1d71
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="relative z-1 p-1 rounded-2xl bg-conic-gradient">
          <div className="max-w-md w-full space-y-8 bg-gray-900 p-10 rounded-xl shadow-md">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white">Login</h2>
              <p className="mt-2 text-sm text-gray-400">
                Enter your email below to login to your account.
              </p>
            </div>

<<<<<<< HEAD
            <form onSubmit={handleSubmit} className="space-y-4">
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

=======
            {/* {errorMessage && (
              <div className="text-red-500 text-sm text-center">{errorMessage}</div>
            )} */}

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

>>>>>>> 435766c2d350d58a56e714c8f6feca6f58eb1d71
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