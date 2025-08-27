import { useState } from 'react';
import { linkEmailPassword } from '../firebase/auth';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';

const SetPasswordModal = ({ isOpen, onClose, userEmail, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('at least 8 characters');
    if (!/[a-z]/.test(password)) errors.push('one lowercase letter');
    if (!/[A-Z]/.test(password)) errors.push('one uppercase letter');
    if (!/\d/.test(password)) errors.push('one number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('one special character');
    return errors;
  };

  const handleSubmit = async (e) => {
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
    const result = await linkEmailPassword(userEmail, password);
    
    if (result.success) {
      toast.success("Password set successfully! You can now sign in with either Google or email/password.");
      onSuccess();
      onClose();
    } else {
      setError(result.error);
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  const handleSkip = () => {
    toast.info("You can set a password later from your profile settings.");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-n-8 border border-n-6 rounded-lg max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-n-4 hover:text-n-1 transition-colors"
        >
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-n-1 mb-2">
            Set up Password
          </h2>
          <p className="text-n-4 text-sm">
            You&apos;re signed in with Google! Would you like to set a password so you can also sign in with email and password?
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:outline-none focus:border-color-1 transition-colors"
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
                className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:outline-none focus:border-color-1 transition-colors"
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
          <div className="text-xs text-n-4 bg-n-7 border border-n-6 rounded-lg p-3">
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
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Setting Password...' : 'Set Password'}
            </button>
            <button
              type="button"
              onClick={handleSkip}
              disabled={loading}
              className="flex-1 bg-n-6 text-n-2 font-medium py-3 px-4 rounded-lg hover:bg-n-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Skip for now
            </button>
          </div>
        </form>

        {/* Footer note */}
        <p className="text-xs text-n-4 text-center mt-4">
          You can always set a password later from your profile settings.
        </p>
      </div>
    </div>
  );
};

export default SetPasswordModal;
