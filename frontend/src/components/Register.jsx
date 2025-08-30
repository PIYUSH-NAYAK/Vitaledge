import { useState } from 'react';
import { registerUser, signInWithGoogle } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import InputControls from "./common/Inputcontrols";
import Section from "./mycomp2/Section";
import OTPVerification from "./OTPVerification";

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const { user, triggerPasswordSetup } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    const validatePassword = (password) => {
      const errors = [];
      if (password.length < 8) errors.push('at least 8 characters');
      if (!/[a-z]/.test(password)) errors.push('one lowercase letter');
      if (!/[A-Z]/.test(password)) errors.push('one uppercase letter');
      if (!/\d/.test(password)) errors.push('one number');
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('one special character');
      return errors;
    };

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      const errorMessage = `Password must contain: ${passwordErrors.join(', ')}`;
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return;
    }

    // Send OTP for email verification
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/otp/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('OTP sent to your email! Please verify to complete registration.');
        setPendingEmail(formData.email);
        setShowOTPVerification(true);
      } else {
        // Handle specific error cases
        if (data.errorCode === 'user-already-exists') {
          toast.error('You are already registered! Redirecting to login...');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError(data.message || 'Failed to send OTP');
          toast.error(data.message || 'Failed to send OTP');
        }
      }
    } catch (error) {
      console.error('OTP send error:', error);
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    }
    
    setLoading(false);
  };

  const handleOTPVerificationSuccess = async (userData) => {
    // Now register with Firebase using verified email
    const result = await registerUser(userData.email, formData.password, userData.name);
    
    if (result.success) {
      // Simple welcome message for new users (same as login)
      const userName = userData.name || userData.email?.split('@')[0] || 'User';
      toast.success(`Welcome, ${userName}! 👋`);
      setTimeout(() => navigate('/'), 1500);
    } else {
      setError(result.error);
      // Show error toast so user knows what went wrong
      toast.error(result.error);
      // Go back to registration form
      setShowOTPVerification(false);
    }
  };

  const handleBackToRegistration = () => {
    setShowOTPVerification(false);
    setPendingEmail('');
  };  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    const result = await signInWithGoogle();
    
    if (result.success) {
      toast.success("Google Sign-In successful! Redirecting...");
      console.log('Google Sign-In successful:', result.user);
      
      // Check if this is a new user who signed up with Google
      if (result.isNewUser) {
        // Trigger password setup modal for new Google users
        triggerPasswordSetup(result.user);
      }
      setTimeout(() => navigate('/'), 1000);
    } else {
      setError(result.error);
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  return (
    <>
      {showOTPVerification ? (
        <OTPVerification
          email={pendingEmail}
          name={formData.name}
          onVerificationSuccess={handleOTPVerificationSuccess}
          onBackToRegistration={handleBackToRegistration}
        />
      ) : (
        <Section className="pt-[6rem] -mt-[12rem]" crosses>
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
      
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="relative z-1 p-1 rounded-2xl bg-conic-gradient">
          <div className="max-w-md w-screen space-y-8 bg-gray-900 p-10 rounded-xl shadow-md">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white">Sign Up</h2>
              <p className="mt-2 text-sm text-gray-400">Create your account</p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <InputControls
                label="Name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              
              <InputControls
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              
              <div className="relative">
                <InputControls
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
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
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
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
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 transition disabled:opacity-50"
                >
                  <FaGoogle className="w-5 h-5 mr-2" />
                  Sign up with Google
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
    </Section>
      )}
    </>
  );
};

export default Register;
