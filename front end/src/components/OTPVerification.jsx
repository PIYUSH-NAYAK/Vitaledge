import { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

const OTPVerification = ({ 
  email, 
  onVerificationSuccess, 
  onBackToRegistration,
  name 
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  // Timer countdown
  useState(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/otp/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          otp: otpString
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Email verified successfully!');
        onVerificationSuccess(data.userData);
      } else {
        toast.error(data.message || 'Invalid OTP');
        // Clear OTP inputs on error
        setOtp(['', '', '', '', '', '']);
        const firstInput = document.getElementById('otp-0');
        if (firstInput) firstInput.focus();
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/otp/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('New OTP sent to your email');
        setTimeLeft(600); // Reset timer
        setOtp(['', '', '', '', '', '']); // Clear inputs
        const firstInput = document.getElementById('otp-0');
        if (firstInput) firstInput.focus();
      } else {
        toast.error(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
      
      <div className="relative z-1 p-1 rounded-2xl bg-conic-gradient">
        <div className="max-w-md w-full space-y-8 bg-gray-900 p-8 rounded-xl shadow-md">
          
          {/* Back button */}
          <button
            onClick={onBackToRegistration}
            className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Registration
          </button>

          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <FaEnvelope className="text-white text-2xl" />
            </div>
            
            <h2 className="text-3xl font-extrabold text-white">
              Verify Your Email
            </h2>
            
            <p className="text-gray-400 text-sm">
              We&apos;ve sent a 6-digit verification code to
            </p>
            <p className="text-white font-medium">{email}</p>
          </div>

          {/* OTP Input */}
          <div className="space-y-6">
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400 transition-colors"
                  autoComplete="off"
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Code expires in: <span className="text-white font-medium">{formatTime(timeLeft)}</span>
              </p>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.join('').length !== 6}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-400 to-pink-400 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Didn&apos;t receive the code?{" "}
                <button
                  onClick={handleResendOTP}
                  disabled={resendLoading || timeLeft > 540} // Allow resend after 1 minute
                  className="text-purple-400 hover:text-purple-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {resendLoading ? 'Sending...' : 'Resend OTP'}
                </button>
              </p>
              {timeLeft > 540 && (
                <p className="text-gray-500 text-xs mt-1">
                  You can resend after {formatTime(timeLeft - 540)}
                </p>
              )}
            </div>
          </div>

          {/* Help text */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-xs text-center">
              Check your spam folder if you don&apos;t see the email. 
              The verification code is valid for 10 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
