import { useState } from "react";
import { Link } from "react-router-dom";
import InputControls from "../../comp2/Inputcontrols";
import { useAuth } from "../../store/auth";
import { useNavigate } from "react-router-dom";
const URI = "http://localhost:7777/register";


// const InputControls = ({ label, type, placeholder, value, onChange }) => (
//   <div className="mb-4">
//     <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor={label}>
//       {label}
//     </label>
//     <input
//       className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-800 leading-tight focus:outline-none focus:shadow-outline placeholder-gray-500"
//       id={label}
//       type={type}
//       placeholder={placeholder}
//       value={value}
//       onChange={onChange}
//     />
//   </div>
// );

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const nav = useNavigate();


  const {storeToken} = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();

    const signupData = { name, email, password, confirmPassword };
    // console.log("i am her 1")

    try {
      
      const response= await fetch(URI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });
      const data = await response.json();
      // console.log("i am here 2")

      if(response.ok){
        console.log("Signup Successful");
        storeToken(data.token);
        nav('/login');


        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrorMessage("");
      }
      else{
        console.log("Signup Failed");
        if(data.message){
          console.log(data.message);
      }
      setErrorMessage(data.msg || "Signup failed");
      }
      
    } catch (error) {
      console.log("Registration Failed");
      console.log(error);
      
    }


    // Add your signup logic here
    // console.log("Signup with:", { name, email, password });
  };

  return (
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => console.log("Login with Google")}
              className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
            >
              Login with Google
            </button>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-teal-500 hover:text-teal-400">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SignupForm;