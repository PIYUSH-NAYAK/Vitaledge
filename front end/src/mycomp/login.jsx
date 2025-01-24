import { useState } from 'react';

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white relative">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/sc23.png")', opacity: 0.3 }}></div>
      <div className={`relative w-[900px] h-[550px] bg-white shadow-xl rounded-lg overflow-hidden z-10 ${isSignUp ? 's-signup' : ''}`}>
        {/* Sign In Form */}
        <div className={`absolute w-[640px] h-full p-8 transition-transform duration-1000 ${isSignUp ? 'translate-x-[640px]' : ''}`}>
          <h2 className="text-3xl font-bold text-center">Sign In</h2>
          <div className="mt-8 space-y-6">
            <label className="block">
              <span className="block text-gray-600 font-semibold uppercase text-sm">Email Address</span>
              <input
                type="email"
                name="email"
                className="w-full mt-2 border-b border-gray-400 focus:outline-none focus:border-black p-2 text-center"
              />
            </label>
            <label className="block">
              <span className="block text-gray-600 font-semibold uppercase text-sm">Password</span>
              <input
                type="password"
                name="password"
                className="w-full mt-2 border-b border-gray-400 focus:outline-none focus:border-black p-2 text-center"
              />
            </label>
            <button className="w-full py-2 mt-6 bg-gray-800 text-white font-semibold uppercase rounded-full hover:bg-black">
              Sign In
            </button>
          </div>
          <div className="flex justify-center mt-6 space-x-4">
            <img src="/images/facebook.png" alt="Facebook" className="w-6 h-6" />
            <img src="/images/twitter.png" alt="Twitter" className="w-6 h-6" />
            <img src="/images/linkedin.png" alt="LinkedIn" className="w-6 h-6" />
            <img src="/images/instagram.png" alt="Instagram" className="w-6 h-6" />
          </div>
        </div>

        {/* Sign Up Form */}
        <div className={`absolute w-[640px] h-full p-8 transition-transform duration-1000 ${isSignUp ? '' : 'translate-x-[640px]'}`}>
          <h2 className="text-3xl font-bold text-center">Sign Up</h2>
          <div className="mt-8 space-y-6">
            <label className="block">
              <span className="block text-gray-600 font-semibold uppercase text-sm">Email Address</span>
              <input
                type="email"
                name="email"
                className="w-full mt-2 border-b border-gray-400 focus:outline-none focus:border-black p-2 text-center"
              />
            </label>
            <label className="block">
              <span className="block text-gray-600 font-semibold uppercase text-sm">Password</span>
              <input
                type="password"
                name="password"
                className="w-full mt-2 border-b border-gray-400 focus:outline-none focus:border-black p-2 text-center"
              />
            </label>
            <button className="w-full py-2 mt-6 bg-gray-800 text-white font-semibold uppercase rounded-full hover:bg-black">
              Sign Up
            </button>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSignUp}
          className="absolute bottom-4 right-4 py-2 px-4 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600"
        >
          {isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
        </button>
      </div>
    </div>
  );
}

export default Login;