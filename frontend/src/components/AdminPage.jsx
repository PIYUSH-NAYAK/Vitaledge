import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaUsers, FaUserPlus, FaUserMinus } from "react-icons/fa";

const AdminPage = () => {
  const { user } = useAuth();
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        if (user) {
          const idTokenResult = await user.getIdTokenResult();
          setIsAdmin(!!idTokenResult.claims.admin);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setLoading(false);
      }
    };
    
    checkStatus();
  }, [user]);

  const handleSetAdminClaim = async () => {
    if (!userEmail) {
      toast.error("Please enter a user email");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/admin/set-custom-claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({
          email: userEmail,
          customClaims: { admin: true }
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Admin claim set for ${userEmail}`);
        setUserEmail("");
        // Refresh user list if it's currently shown
        if (showUserList) {
          fetchUsers();
        }
      } else {
        toast.error(data.message || "Failed to set admin claim");
      }
    } catch (error) {
      console.error("Error setting admin claim:", error);
      toast.error("Error setting admin claim");
    }
  };

  const handleRemoveAdminClaim = async (email) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/admin/set-custom-claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({
          email: email,
          customClaims: {} // Remove all custom claims
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Admin privileges removed from ${email}`);
        // Refresh user list
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to remove admin claim");
      }
    } catch (error) {
      console.error("Error removing admin claim:", error);
      toast.error("Error removing admin claim");
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/admin/users`, {
        headers: {
          "Authorization": `Bearer ${await user.getIdToken()}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
      } else {
        toast.error(data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const toggleUserList = () => {
    setShowUserList(!showUserList);
    if (!showUserList) {
      fetchUsers();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl mb-4">Access Denied</h2>
          <p>You don&apos;t have admin privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Hi Admin! 👋
            </h1>
            <p className="text-gray-300">
              Welcome to the admin dashboard. Manage user permissions, medicines, and system settings.
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Medicine Management */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Medicine Management
              </h2>
              <p className="text-gray-300 mb-6">
                Add new medicines to the catalog with images and detailed information.
              </p>
              <div className="space-y-3">
                <a
                  href="/admin/add-medicine"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Medicine
                </a>
                <a
                  href="/admin/manage-stock"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1v9a3 3 0 01-3 3H6a3 3 0 01-3-3V7a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
                  </svg>
                  Manage Stock
                </a>
                <a
                  href="/medicines"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  View All Medicines
                </a>
              </div>
            </div>

            {/* User Management Quick Actions */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">
                User Management
              </h2>
              <p className="text-gray-300 mb-6">
                Manage user permissions and admin privileges.
              </p>
              <button
                onClick={toggleUserList}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FaUsers />
                {showUserList ? "Hide Users" : "View All Users"}
              </button>
            </div>
          </div>

          {/* User Management Details */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-6">
              Grant Admin Privileges
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter user email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSetAdminClaim}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaUserPlus />
                Set Admin Claim
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              This will grant admin privileges to the specified user.
            </p>

            {/* User List */}
            {showUserList && (
              <div className="border-t border-gray-600 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">
                  All Users
                </h3>
                {loadingUsers ? (
                  <div className="text-center py-4">
                    <div className="text-gray-400">Loading users...</div>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {users.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">No users found</p>
                    ) : (
                      users.map((userData) => (
                        <div key={userData.uid} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="text-white font-medium">{userData.email}</p>
                                <p className="text-gray-400 text-sm">UID: {userData.uid}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  {userData.customClaims?.admin ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                                      <FaUserPlus size={10} />
                                      Admin
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full">
                                      User
                                    </span>
                                  )}
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    userData.emailVerified 
                                      ? "bg-green-600 text-white" 
                                      : "bg-yellow-600 text-white"
                                  }`}>
                                    {userData.emailVerified ? "Verified" : "Unverified"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {userData.customClaims?.admin ? (
                              <button
                                onClick={() => handleRemoveAdminClaim(userData.email)}
                                className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                title="Remove Admin Privileges"
                              >
                                <FaUserMinus size={12} />
                                Remove Admin
                              </button>
                            ) : (
                              <button
                                onClick={async () => {
                                  const originalEmail = userEmail;
                                  setUserEmail(userData.email);
                                  await handleSetAdminClaim();
                                  setUserEmail(originalEmail);
                                }}
                                className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                title="Grant Admin Privileges"
                              >
                                <FaUserPlus size={12} />
                                Make Admin
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Current Admin Info */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Current Admin Info
            </h2>
            <div className="space-y-2">
              <p className="text-gray-300">
                <span className="font-medium">Email:</span> {user?.email}
              </p>
              <p className="text-gray-300">
                <span className="font-medium">UID:</span> {user?.uid}
              </p>
              <p className="text-gray-300">
                <span className="font-medium">Admin Status:</span> 
                <span className="text-green-400 ml-2">✓ Active</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
