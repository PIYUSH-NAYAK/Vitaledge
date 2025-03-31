import { useState } from "react";
import { Link } from "react-router-dom";
import InputControls from "../../comp2/Inputcontrols";
// import { useAuth } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles for Toastify
import Section from "../mycomp2/Section";
const URI = `${import.meta.env.VITE_APP_BACKEND_URL}/register`;



const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const nav = useNavigate();


  // const {storeToken} = useAuth();

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
        }, 100); // Delay the toast by 100ms        console.log("Signup Successful");
        // storeToken(data.token);
        nav("/login");
  
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        // setErrorMessage("");
      } else {
        // Set error message with priority
        console.log(data);
        if (data.message) {
          console.log(data.message);
          const lowerCaseMsg = data.message.toLowerCase();
          
          // Priority order: email > password > confirmPassword > name
          if (lowerCaseMsg.includes("email")) {
            toast.error(data.message||data.error)
            // setErrorMessage(data.message);
          } else if (lowerCaseMsg.includes("password")) {
            toast.error(data.message||data.error)
            // setErrorMessage(data.message);
          } else if (lowerCaseMsg.includes("name")) {
            toast.error(data.message||data.error)

            // setErrorMessage(data.message);
          } else {
            toast.error(data.message||data.error)

            // setErrorMessage(data.message);
          }
        } else {
          toast.error(data.message||data.error)

          // setErrorMessage(data.error || "Signup failed");
        }
      }
    } catch (error) {
      console.log("Registration Failed");
      console.log(error);
      toast.error("Registration Failed");

      // setErrorMessage("Registration failed. Please try again.");
    }
  };

  return (
    <Section
    className="pt-[4rem] -mt-[5.25rem]"
    crosses
    crossesOffset="lg:translate-y-[5.25rem]"
    customPaddings
    id="hero"
  >
    {/* ✅ Toast Container for Notifications */}
    <ToastContainer
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
      
      <div className="relative z-1 p-1   rounded-2xl bg-conic-gradient">

      
      <div className="max-w-md w-screen space-y-8 bg-gray-900 p-10 rounded-xl shadow-md">
        <div>
          <h2 className=" text-center text-3xl font-extrabold text-white">Sign Up</h2>
          <p className="mt-2 text-center text-sm text-gray-400">Create your account</p>
        </div>
       
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
          <InputControls
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputControls
            label="Confirm Password"
            type="password"
            placeholder="Enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-teal-600 text-white rounded-md"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="mt-6">  
          <div className="relative">
            {/* <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div> */}
            {/* <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
            </div> */}
          </div>
          {/* <div className="mt-6">
            <button
              onClick={() => console.log("Login with Google")}
              className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
            >
              Login with Google
            </button>
          </div> */}
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-500 hover:text-teal-400">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
    </div>
    </Section>
  );
};

export default SignupForm;