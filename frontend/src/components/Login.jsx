import { useState } from 'react';
import { loginUser, signInWithGoogleAndLink } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import InputControls from "./common/Inputcontrols";
import Section from "./mycomp2/Section";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await loginUser(email, password);
    
    if (result.success) {
      // Simple login success message
      const userName = result.user?.displayName || result.user?.email?.split('@')[0] || 'User';
      toast.success(`Welcome back, ${userName}! 👋`);
      console.log('Login successful:', result.user);
      setTimeout(() => navigate('/'), 1500);
    } else {
      setError(result.error);
      // Show error toast so user knows what went wrong
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    const result = await signInWithGoogleAndLink();
    
    if (result.success) {
      // Simple login success message for both new and returning users
      const userName = result.user?.displayName || result.user?.email?.split('@')[0] || 'User';
      toast.success(`Welcome, ${userName}! 👋`);
      
      // Check if this is a new user
      if (result.isNewUser) {
        // Trigger password setup modal for new Google users
        triggerPasswordSetup(result.user);
      }
      
      console.log('Google Sign-In successful:', result.user);
      setTimeout(() => navigate('/'), 1500);
    } else if (result.error === 'account-exists-email-password' && result.canAutoLink) {
      // Email/password account exists - auto-link Google account
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      setError(result.error || result.message);
      // Show error toast so user knows what went wrong
      toast.error(result.error || result.message);
    }
    
    setLoading(false);
  };

  return (
    <Section className="pt-[6rem] -mt-[12rem]" crosses>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="relative z-1 p-1 rounded-2xl bg-conic-gradient">
          <div className="max-w-md w-auto space-y-8 bg-gray-900 p-16 rounded-xl shadow-md">
            <div className="text-center pt-2 space-y-5">
              <h2 className="text-4xl font-extrabold -mt-[2rem] text-white">Login</h2>
              <p className="mt-2 text-sm text-gray-400">
                Enter your email below to login to your account.
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              <InputControls
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="relative">
                <InputControls
                  label="Password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 transition disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Login'}
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
                  Sign in with Google
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don&apos;t have an account?{" "}
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
