import { logoutUser } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Section from './mycomp2/Section';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      toast.success("Logged out successfully!");
      navigate('/login');
    } else {
      toast.error("Error logging out");
    }
  };

  return (
    <Section className="pt-[6rem] -mt-[5.25rem]" crosses crossesOffset="lg:translate-y-[5.25rem]" customPaddings id="dashboard">
      <div className="min-h-screen bg-n-8">
        {/* Header */}
        <div className="bg-n-7 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-n-1">
                  VitalEdge Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-n-3">
                  Welcome, {user?.displayName || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-n-6 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-n-1 mb-4">
                Welcome to VitalEdge!
              </h2>
              <div className="bg-n-7 shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-n-1 mb-4">
                  User Information
                </h3>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-n-4">Name</dt>
                    <dd className="mt-1 text-sm text-n-2">
                      {user?.displayName || 'Not provided'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-n-4">Email</dt>
                    <dd className="mt-1 text-sm text-n-2">{user?.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-n-4">User ID</dt>
                    <dd className="mt-1 text-xs text-n-2 font-mono">{user?.uid}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-n-4">Account Status</dt>
                    <dd className="mt-1 text-sm text-green-400">Active</dd>
                  </div>
                </dl>
              </div>
              
              {/* Quick Actions */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-n-1 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => navigate('/products')}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-md font-medium transition"
                  >
                    View Products
                  </button>
                  <button
                    onClick={() => navigate('/contact')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition"
                  >
                    Contact Us
                  </button>
                  <button
                    onClick={() => navigate('/aboutus')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium transition"
                  >
                    About Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Section>
  );
};

export default Dashboard;
