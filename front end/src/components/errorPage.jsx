// src/pages/Error404.jsx

import { Link } from 'react-router-dom';

const Error404 = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-extrabold text-gray-800">404</h1>
        <p className="text-2xl font-semibold text-gray-600 mt-4">
          Oops! Page Not Found
        </p>
        <p className="text-gray-500 mt-2 pb-4">
          The page you’re looking for doesn’t exist.
        </p>
        <Link
          to="/"
          className="mt-6 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default Error404;
