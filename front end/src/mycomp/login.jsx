import { useState, useEffect } from 'react';

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };

  useEffect(() => {
    const switchToSignUp = setTimeout(() => {
      setIsSignUp(true);
    }, 1000);

    const switchToLogin = setTimeout(() => {
      setIsSignUp(false);
    }, 3000);

    return () => {
      clearTimeout(switchToSignUp);
      clearTimeout(switchToLogin);
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-400 font-roboto">
      <div className="relative flex w-[600px] h-[350px]">
        <div className="absolute w-full h-[80%] bg-gray-800 flex top-1/2 transform -translate-y-1/2">
          <div className={`w-1/2 h-full text-sm box-border ${isSignUp ? 'opacity-0 transition-opacity duration-700' : 'opacity-100 transition-opacity duration-700'}`}>
            <div className="text-white mt-16 ml-12">
              <p className="font-light text-[23px]">Don't have an account?</p>
              <p className="font-thin">Sign up to save all your graph.</p>
              <button id="switch1" onClick={toggleSignUp} className="bg-gray-800 border-2 border-white rounded-lg text-white text-xs font-light py-2 mt-5">Sign Up</button>
            </div>
          </div>
          <div className={`w-1/2 h-full text-sm box-border ${isSignUp ? 'opacity-100 transition-opacity duration-700' : 'opacity-0 transition-opacity duration-700'}`}>
            <div className="text-white mt-16 ml-12">
              <p className="font-light text-[23px]">Have an account?</p>
              <p className="font-thin">Log in to see all your collection.</p>
              <button id="switch2" onClick={toggleSignUp} className="bg-gray-800 border-2 border-white rounded-lg text-white text-xs font-light py-2 mt-5">LOG IN</button>
            </div>
          </div>
        </div>

        <div className={`absolute bg-white rounded-2xl h-full w-1/2 right-0 mx-3 transition-all duration-700 ${isSignUp ? 'right-[45%]' : ''}`}>
          <div className={`p-5 text-center ${isSignUp ? 'hidden' : ''}`}>
            <h2 className="text-green-600 text-lg">LOG IN</h2>
            <div className="mt-8">
              <input type="text" name="email" placeholder="  EMAIL" className="block w-full h-10 bg-gray-200 mb-5 text-xs" />
              <input type="password" name="password" placeholder="  PASSWORD" className="block w-full h-10 bg-gray-200 mb-5 text-xs" />
            </div>
            <p className="text-gray-800 text-sm cursor-pointer">FORGET PASSWORD?</p>
            <button className="bg-green-600 text-white text-xs font-light py-2 px-4 rounded-lg absolute bottom-7 right-7">LOG IN</button>
          </div>

          <div className={`p-5 text-center ${isSignUp ? '' : 'hidden'}`}>
            <h2 className="text-green-600 text-lg">SIGN UP</h2>
            <div className="mt-8">
              <input type="text" name="fullname" placeholder="  FULLNAME" className="block w-full h-10 bg-gray-200 mb-5 text-xs" />
              <input type="text" name="email" placeholder="  EMAIL" className="block w-full h-10 bg-gray-200 mb-5 text-xs" />
              <input type="password" name="password" placeholder="  PASSWORD" className="block w-full h-10 bg-gray-200 mb-5 text-xs" />
            </div>
            <button className="bg-green-600 text-white text-xs font-light py-2 px-4 rounded-lg absolute bottom-7 right-7">SIGN UP</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
