import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaPlus, FaMinus, FaEdit, FaSearch, FaSync } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const ManageStock = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [stockToAdd, setStockToAdd] = useState("");

  // Fetch medicines
  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/medicines`);
      const data = await response.json();
      
      if (response.ok && data.medicines) {
        setMedicines(data.medicines);
      } else if (response.ok && Array.isArray(data)) {
        setMedicines(data);
      } else {
        toast.error("Failed to fetch medicines");
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
      toast.error("Error loading medicines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
    
    const handleFocus = () => {
      fetchMedicines();
    };
    
    const handleMedicineAdded = () => {
      fetchMedicines();
    };
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('medicineAdded', handleMedicineAdded);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('medicineAdded', handleMedicineAdded);
    };
  }, [location]); // Re-run when location changes (navigating to this page)

  // Update stock
  const handleUpdateStock = async (medicineId, newStock) => {
    if (!user) {
      toast.error("Please log in to update stock");
      return;
    }

    if (newStock < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/medicines/${medicineId}/stock`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ stock: parseInt(newStock) })
      });

      const data = await response.json();
      
      if (data.success) {
        const updatedMedicines = medicines.map(med => 
          med._id === medicineId ? { ...med, stock: { ...med.stock, quantity: parseInt(newStock) } } : med
        );
        setMedicines(updatedMedicines);
        toast.success("Stock updated successfully");
        setSelectedMedicine(null);
        setStockToAdd("");
      } else {
        toast.error(data.message || "Failed to update stock");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Error updating stock");
    }
  };

  // Quick stock adjustment
  const handleQuickAdjust = async (medicineId, currentStock, adjustment) => {
    const newStock = currentStock + adjustment;
    await handleUpdateStock(medicineId, newStock);
  };

  // Filter medicines based on search
  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (medicine.manufacturer && medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading medicines...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">Stock Management</h1>
              <p className="text-gray-300">Manage medicine inventory and stock levels</p>
            </div>
            <button
              onClick={() => fetchMedicines()}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              title="Refresh medicine list"
            >
              <FaSync className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search medicines by name or manufacturer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Medicines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicines.map((medicine) => (
            <div key={medicine._id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              {/* Medicine Info */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-white mb-2">{medicine.name}</h3>
                <p className="text-gray-300 text-sm mb-1">Manufacturer: {medicine.manufacturer}</p>
                <p className="text-gray-300 text-sm">Price: ₹{medicine.price?.discountedPrice || medicine.price?.mrp || 'N/A'}</p>
              </div>

              {/* Current Stock */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Current Stock:</span>
                  <span className={`font-bold text-lg ${
                    (medicine.stock?.quantity || 0) < 10 ? 'text-red-500' : 
                    (medicine.stock?.quantity || 0) < 50 ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {medicine.stock?.quantity || 0} {medicine.stock?.unit || 'units'}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                {/* Quick Adjust */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleQuickAdjust(medicine._id, medicine.stock?.quantity || 0, -10)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
                    disabled={(medicine.stock?.quantity || 0) < 10}
                  >
                    <FaMinus size={12} />
                    -10
                  </button>
                  <button
                    onClick={() => handleQuickAdjust(medicine._id, medicine.stock?.quantity || 0, 10)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <FaPlus size={12} />
                    +10
                  </button>
                  <button
                    onClick={() => handleQuickAdjust(medicine._id, medicine.stock?.quantity || 0, 50)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <FaPlus size={12} />
                    +50
                  </button>
                </div>

                {/* Custom Stock Input */}
                {selectedMedicine === medicine._id ? (
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Enter new stock amount"
                      value={stockToAdd}
                      onChange={(e) => setStockToAdd(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      min="0"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStock(medicine._id, stockToAdd)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors"
                        disabled={!stockToAdd}
                      >
                        Update Stock
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMedicine(null);
                          setStockToAdd("");
                        }}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedMedicine(medicine._id);
                      setStockToAdd((medicine.stock?.quantity || 0).toString());
                    }}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaEdit size={14} />
                    Set Custom Stock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No medicines found */}
        {filteredMedicines.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No medicines found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStock;
