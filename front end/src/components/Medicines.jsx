import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/mycomp2/Section';
import Button from '../components/mycomp2/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    prescriptionRequired: '',
    sort: 'newest'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasMore: false
  });
  const [categories, setCategories] = useState([]);

  // Fetch medicines
  const fetchMedicines = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value !== '')
        )
      });

      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/medicines?${queryParams}`
      );

      if (response.ok) {
        const data = await response.json();
        setMedicines(data.medicines);
        setPagination(data.pagination);
      } else {
        toast.error('Failed to fetch medicines');
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
      toast.error('Error loading medicines');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/medicines/categories`
      );
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchMedicines(1);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      prescriptionRequired: '',
      sort: 'newest'
    });
  };

  return (
    <Section
      className="pt-[4rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="medicines"
    >
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

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Medicines</h1>
          <p className="text-gray-400 text-lg">
            Find the medicines you need with detailed information and competitive prices
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search medicines..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Sort */}
            <div>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="name">Name A-Z</option>
                <option value="price_low_high">Price: Low to High</option>
                <option value="price_high_low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Prescription Filter & Clear */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-4">
              <label className="flex items-center text-gray-300">
                <input
                  type="radio"
                  name="prescription"
                  value=""
                  checked={filters.prescriptionRequired === ''}
                  onChange={(e) => handleFilterChange('prescriptionRequired', e.target.value)}
                  className="mr-2"
                />
                All Medicines
              </label>
              <label className="flex items-center text-gray-300">
                <input
                  type="radio"
                  name="prescription"
                  value="false"
                  checked={filters.prescriptionRequired === 'false'}
                  onChange={(e) => handleFilterChange('prescriptionRequired', e.target.value)}
                  className="mr-2"
                />
                No Prescription
              </label>
              <label className="flex items-center text-gray-300">
                <input
                  type="radio"
                  name="prescription"
                  value="true"
                  checked={filters.prescriptionRequired === 'true'}
                  onChange={(e) => handleFilterChange('prescriptionRequired', e.target.value)}
                  className="mr-2"
                />
                Prescription Required
              </label>
            </div>
            <Button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {medicines.length} of {pagination.total} medicines
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Medicines Grid */}
            {medicines.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                {medicines.map((medicine) => (
                  <div
                    key={medicine._id}
                    className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Medicine Image */}
                    <div className="relative">
                      <img
                        src={medicine.images?.primary?.url || '/placeholder-medicine.svg'}
                        alt={medicine.name}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                      {medicine.prescriptionRequired && (
                        <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                          Rx Required
                        </span>
                      )}
                      {medicine.price.discount > 0 && (
                        <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                          {medicine.price.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Medicine Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
                        {medicine.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {medicine.genericName}
                      </p>
                      <p className="text-gray-500 text-sm mb-2">
                        by {medicine.manufacturer}
                      </p>
                      
                      {/* Dosage */}
                      <div className="mb-3">
                        <span className="text-gray-300 text-sm">
                          {medicine.dosage?.strength} {medicine.dosage?.form}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-green-500">
                            ₹{medicine.price.discountedPrice}
                          </span>
                          {medicine.price.discount > 0 && (
                            <span className="text-gray-500 line-through text-sm">
                              ₹{medicine.price.mrp}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stock Status */}
                      <div className="mb-4">
                        {medicine.stock.quantity > 0 ? (
                          <span className="text-green-500 text-sm">
                            In Stock ({medicine.stock.quantity} {medicine.stock.unit})
                          </span>
                        ) : (
                          <span className="text-red-500 text-sm">Out of Stock</span>
                        )}
                      </div>

                      {/* View Details Button */}
                      <Link
                        to={`/medicines/${medicine.slug}`}
                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg transition-colors duration-300"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No medicines found</p>
                <Button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <Button
                  onClick={() => fetchMedicines(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg"
                >
                  Previous
                </Button>
                
                <span className="text-gray-400">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <Button
                  onClick={() => fetchMedicines(pagination.currentPage + 1)}
                  disabled={!pagination.hasMore}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Section>
  );
};

export default Medicines;
