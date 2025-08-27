import { useState, useEffect } from 'react';
import { getCurrentUser, checkSignInMethods, linkEmailPassword } from '../firebase/auth';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaCheck, FaTimes } from 'react-icons/fa';
import Section from './mycomp2/Section';

const ProfileSettings = () => {
  const [user, setUser] = useState(null);
  const [signInMethods, setSignInMethods] = useState([]);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        
        // Check available sign-in methods
        const methodsResult = await checkSignInMethods(currentUser.email);
        if (methodsResult.success) {
          setSignInMethods(methodsResult.methods);
        }
      }
    };

    fetchUserData();
  }, []);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('at least 8 characters');
    if (!/[a-z]/.test(password)) errors.push('one lowercase letter');
    if (!/[A-Z]/.test(password)) errors.push('one uppercase letter');
    if (!/\d/.test(password)) errors.push('one number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('one special character');
    return errors;
  };

  const handleAddPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate password
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      const errorMessage = `Password must contain: ${passwordErrors.join(', ')}`;
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    // Link password to account
    const result = await linkEmailPassword(user.email, password);
    
    if (result.success) {
      toast.success("Password added successfully! You can now sign in with email and password.");
      setShowPasswordForm(false);
      setPassword('');
      setConfirmPassword('');
      
      // Refresh sign-in methods
      const methodsResult = await checkSignInMethods(user.email);
      if (methodsResult.success) {
        setSignInMethods(methodsResult.methods);
      }
    } else {
      setError(result.error);
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  const hasGoogleAuth = signInMethods.includes('google.com');
  const hasPasswordAuth = signInMethods.includes('password');

  if (!user) {
    return (
      <Section className="pt-[6rem] -mt-[12rem]" crosses>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </Section>
    );
  }

  return (
    <Section className="pt-[6rem] -mt-[12rem]" crosses>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Profile Settings</h1>
            <p className="text-n-4">Manage your account settings and sign-in methods</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* User Information */}
            <div className="bg-n-8 border border-n-6 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">User Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-n-3 mb-2">Name</label>
                  <div className="text-n-1">{user.displayName || 'Not provided'}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-n-3 mb-2">Email</label>
                  <div className="text-n-1">{user.email}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-n-3 mb-2">User ID</label>
                  <div className="text-n-2 text-xs font-mono break-all">{user.uid}</div>
                </div>
              </div>
            </div>

            {/* Sign-in Methods */}
            <div className="bg-n-8 border border-n-6 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Sign-in Methods</h2>
              
              <div className="space-y-4">
                {/* Google Authentication */}
                <div className="flex items-center justify-between p-4 bg-n-7 border border-n-6 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaGoogle className="text-red-500" size={20} />
                    <div>
                      <div className="text-n-1 font-medium">Google</div>
                      <div className="text-n-4 text-sm">Sign in with your Google account</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasGoogleAuth ? (
                      <>
                        <FaCheck className="text-green-500" size={16} />
                        <span className="text-green-500 text-sm">Enabled</span>
                      </>
                    ) : (
                      <>
                        <FaTimes className="text-red-500" size={16} />
                        <span className="text-red-500 text-sm">Not enabled</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Email/Password Authentication */}
                <div className="flex items-center justify-between p-4 bg-n-7 border border-n-6 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-blue-500" size={20} />
                    <div>
                      <div className="text-n-1 font-medium">Email & Password</div>
                      <div className="text-n-4 text-sm">Sign in with email and password</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasPasswordAuth ? (
                      <>
                        <FaCheck className="text-green-500" size={16} />
                        <span className="text-green-500 text-sm">Enabled</span>
                      </>
                    ) : (
                      <>
                        <FaTimes className="text-red-500" size={16} />
                        <span className="text-red-500 text-sm">Not enabled</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Add Password Button */}
                {!hasPasswordAuth && !showPasswordForm && (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Add Password Sign-in
                  </button>
                )}

                {/* Password Form */}
                {showPasswordForm && (
                  <div className="border border-n-6 rounded-lg p-4 bg-n-7">
                    <h3 className="text-lg font-medium text-n-1 mb-4">Add Password Sign-in</h3>
                    
                    <form onSubmit={handleAddPassword} className="space-y-4">
                      {/* Password field */}
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-n-3 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-n-8 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:outline-none focus:border-color-1 transition-colors"
                            placeholder="Enter your password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-n-4 hover:text-n-1 transition-colors"
                          >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password field */}
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-n-3 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-n-8 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:outline-none focus:border-color-1 transition-colors"
                            placeholder="Confirm your password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-n-4 hover:text-n-1 transition-colors"
                          >
                            {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                          </button>
                        </div>
                      </div>

                      {/* Error message */}
                      {error && (
                        <div className="text-red-500 text-sm">
                          {error}
                        </div>
                      )}

                      {/* Password requirements */}
                      <div className="text-xs text-n-4 bg-n-8 border border-n-6 rounded-lg p-3">
                        <p className="font-medium mb-1">Password must contain:</p>
                        <ul className="space-y-1">
                          <li>• At least 8 characters</li>
                          <li>• One uppercase letter</li>
                          <li>• One lowercase letter</li>
                          <li>• One number</li>
                          <li>• One special character</li>
                        </ul>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Adding Password...' : 'Add Password'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowPasswordForm(false);
                            setPassword('');
                            setConfirmPassword('');
                            setError('');
                          }}
                          disabled={loading}
                          className="flex-1 bg-n-6 text-n-2 font-medium py-3 px-4 rounded-lg hover:bg-n-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ProfileSettings;
