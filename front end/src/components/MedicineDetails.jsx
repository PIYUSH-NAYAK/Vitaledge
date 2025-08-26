import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Section from '../components/mycomp2/Section';
import Button from '../components/mycomp2/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MedicineDetails = () => {
  const { slug } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchMedicineDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/medicines/${slug}`
        );

        if (response.ok) {
          const data = await response.json();
          setMedicine(data);
        } else if (response.status === 404) {
          toast.error('Medicine not found');
        } else {
          toast.error('Failed to fetch medicine details');
        }
      } catch (error) {
        console.error('Error fetching medicine details:', error);
        toast.error('Error loading medicine details');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchMedicineDetails();
    }
  }, [slug]);

  if (loading) {
    return (
      <Section className="pt-[4rem] -mt-[5.25rem]" customPaddings>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </Section>
    );
  }

  if (!medicine) {
    return (
      <Section className="pt-[4rem] -mt-[5.25rem]" customPaddings>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-24">
            <h1 className="text-3xl font-bold text-white mb-4">Medicine Not Found</h1>
            <p className="text-gray-400 mb-8">The medicine you&apos;re looking for doesn&apos;t exist.</p>
            <Link
              to="/medicines"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
            >
              Browse All Medicines
            </Link>
          </div>
        </div>
      </Section>
    );
  }

  const images = [medicine.images.primary?.url, ...(medicine.images.gallery?.map(img => img.url) || [])].filter(Boolean);

  return (
    <Section
      className="pt-[4rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
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
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Link to="/medicines" className="hover:text-white transition-colors">
              Medicines
            </Link>
            <span>/</span>
            <span className="text-white">{medicine.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative">
              <img
                src={images[selectedImage] || '/placeholder-medicine.svg'}
                alt={medicine.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              {medicine.prescriptionRequired && (
                <span className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-lg font-medium">
                  Prescription Required
                </span>
              )}
              {medicine.price.discount > 0 && (
                <span className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-lg font-medium">
                  {medicine.price.discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-blue-500'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${medicine.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Medicine Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{medicine.name}</h1>
              <p className="text-xl text-gray-300 mb-2">{medicine.genericName}</p>
              <p className="text-gray-400">by {medicine.manufacturer}</p>
            </div>

            {/* Dosage & Category */}
            <div className="flex flex-wrap gap-4">
              <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
                {medicine.category}
              </span>
              <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm">
                {medicine.dosage.strength} {medicine.dosage.form}
              </span>
            </div>

            {/* Price */}
            <div className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-3xl font-bold text-green-500">
                  ₹{medicine.price.discountedPrice}
                </span>
                {medicine.price.discount > 0 && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{medicine.price.mrp}
                    </span>
                    <span className="text-green-500 font-medium">
                      Save ₹{medicine.price.mrp - medicine.price.discountedPrice}
                    </span>
                  </>
                )}
              </div>
              <p className="text-gray-400 text-sm">Inclusive of all taxes</p>
            </div>

            {/* Stock Status */}
            <div>
              {medicine.stock.quantity > 0 ? (
                <div className="flex items-center gap-2 text-green-500">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>In Stock ({medicine.stock.quantity} {medicine.stock.unit})</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-500">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Out of Stock</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                disabled={medicine.stock.quantity === 0}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-300"
              >
                {medicine.stock.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              
              {medicine.prescriptionRequired && (
                <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-3">
                  <p className="text-yellow-300 text-sm">
                    📋 This medicine requires a valid prescription. Please upload your prescription during checkout.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Batch Number:</span>
                <p className="text-white">{medicine.batchNumber}</p>
              </div>
              <div>
                <span className="text-gray-400">Expiry Date:</span>
                <p className="text-white">
                  {new Date(medicine.expiryDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <nav className="flex space-x-8">
            {['overview', 'ingredients', 'usage', 'storage'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-900 rounded-lg p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Description</h3>
                <p className="text-gray-300 leading-relaxed">{medicine.description}</p>
              </div>
              
              {medicine.sideEffects && medicine.sideEffects.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Side Effects</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {medicine.sideEffects.map((effect, index) => (
                      <li key={index}>{effect}</li>
                    ))}
                  </ul>
                </div>
              )}

              {medicine.contraindications && medicine.contraindications.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Contraindications</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {medicine.contraindications.map((contraindication, index) => (
                      <li key={index}>{contraindication}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Active Ingredients</h3>
              {medicine.activeIngredients && medicine.activeIngredients.length > 0 ? (
                <div className="space-y-3">
                  {medicine.activeIngredients.map((ingredient, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                      <span className="text-gray-300">{ingredient.name}</span>
                      <span className="text-white font-medium">{ingredient.quantity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No ingredient information available.</p>
              )}
            </div>
          )}

          {activeTab === 'usage' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Usage Instructions</h3>
              {medicine.usage ? (
                <div className="space-y-4">
                  {medicine.usage.dosageInstructions && (
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Dosage Instructions</h4>
                      <p className="text-gray-300">{medicine.usage.dosageInstructions}</p>
                    </div>
                  )}
                  {medicine.usage.frequency && (
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Frequency</h4>
                      <p className="text-gray-300">{medicine.usage.frequency}</p>
                    </div>
                  )}
                  {medicine.usage.duration && (
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Duration</h4>
                      <p className="text-gray-300">{medicine.usage.duration}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400">No usage information available.</p>
              )}
            </div>
          )}

          {activeTab === 'storage' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Storage Information</h3>
              {medicine.storage ? (
                <div className="space-y-4">
                  {medicine.storage.temperature && (
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Temperature</h4>
                      <p className="text-gray-300">{medicine.storage.temperature}</p>
                    </div>
                  )}
                  {medicine.storage.conditions && (
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Storage Conditions</h4>
                      <p className="text-gray-300">{medicine.storage.conditions}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400">No storage information available.</p>
              )}
            </div>
          )}
        </div>

        {/* Back to Medicines */}
        <div className="mt-12 text-center">
          <Link
            to="/medicines"
            className="inline-flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300"
          >
            ← Back to All Medicines
          </Link>
        </div>
      </div>
    </Section>
  );
};

export default MedicineDetails;
