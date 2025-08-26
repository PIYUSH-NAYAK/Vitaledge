import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import ImageUpload from './common/ImageUpload';
import Button from './mycomp2/Button';
import Section from './mycomp2/Section';

const AddMedicine = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    manufacturer: '',
    description: '',
    category: 'Tablet',
    dosage: {
      strength: '',
      form: ''
    },
    price: {
      mrp: '',
      discountedPrice: '',
      discount: 0
    },
    stock: {
      quantity: '',
      unit: 'pieces'
    },
    prescriptionRequired: false,
    tags: '',
    ingredients: '',
    sideEffects: '',
    uses: '',
    precautions: '',
    storage: '',
    expiryDate: '',
    batchNumber: '',
    manufacturingDate: ''
  });

  const categories = [
    'Tablet', 'Capsule', 'Syrup', 'Injection', 
    'Ointment', 'Drops', 'Powder', 'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    console.log('🚨 BUTTON CLICKED - FUNCTION STARTED'); // Most basic debug
    e.preventDefault();
    
    console.log('🔍 Submit button clicked'); // Debug log
    
    if (selectedImages.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    console.log('✅ Images selected:', selectedImages.length); // Debug log
    
    setLoading(true);

    try {
      console.log('📤 Starting form submission...'); // Debug log
      // Prepare form data for multipart upload
      const uploadData = new FormData();
      
      // Add images
      selectedImages.forEach(image => {
        uploadData.append('images', image);
      });

      // Prepare medicine data
      const medicineData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        price: {
          ...formData.price,
          mrp: Number(formData.price.mrp),
          discountedPrice: Number(formData.price.discountedPrice),
          discount: Number(formData.price.discount)
        },
        stock: {
          ...formData.stock,
          quantity: Number(formData.stock.quantity)
        }
      };

      console.log('📋 Form data prepared:', medicineData); // Debug log
      console.log('🌐 Backend URL:', import.meta.env.VITE_APP_BACKEND_URL); // Debug log

      uploadData.append('medicineData', JSON.stringify(medicineData));

      // Get Firebase token
      const token = await user.getIdToken();
      console.log('🔑 Firebase token obtained'); // Debug log

      console.log('📡 Making API request...'); // Debug log
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/medicines/upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadData,
        }
      );

      console.log('📡 Response status:', response.status); // Debug log
      console.log('📡 Response ok:', response.ok); // Debug log

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData); // Debug log
        throw new Error(errorData.message || 'Failed to add medicine');
      }

      const responseData = await response.json();
      console.log('✅ Success response:', responseData); // Debug log
      toast.success('Medicine added successfully!');
      
      // Reset form
      setFormData({
        name: '',
        genericName: '',
        manufacturer: '',
        description: '',
        category: 'Tablet',
        dosage: { strength: '', form: '' },
        price: { mrp: '', discountedPrice: '', discount: 0 },
        stock: { quantity: '', unit: 'pieces' },
        prescriptionRequired: false,
        tags: '',
        ingredients: '',
        sideEffects: '',
        uses: '',
        precautions: '',
        storage: '',
        expiryDate: '',
        batchNumber: '',
        manufacturingDate: ''
      });
      setSelectedImages([]);

    } catch (error) {
      console.error('Error adding medicine:', error);
      toast.error(error.message || 'Failed to add medicine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section className="pt-[4rem] -mt-[5.25rem]" crosses crossesOffset="lg:translate-y-[5.25rem]" customPaddings id="add-medicine">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Add New Medicine
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Generic Name *
                </label>
                <input
                  type="text"
                  name="genericName"
                  value={formData.genericName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Manufacturer *
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Dosage Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dosage Strength *
                </label>
                <input
                  type="text"
                  name="dosage.strength"
                  value={formData.dosage.strength}
                  onChange={handleInputChange}
                  placeholder="e.g., 500mg, 10ml"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dosage Form *
                </label>
                <input
                  type="text"
                  name="dosage.form"
                  value={formData.dosage.form}
                  onChange={handleInputChange}
                  placeholder="e.g., Tablet, Capsule"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  MRP (₹) *
                </label>
                <input
                  type="number"
                  name="price.mrp"
                  value={formData.price.mrp}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  name="price.discountedPrice"
                  value={formData.price.discountedPrice}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="price.discount"
                  value={formData.price.discount}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {/* Stock Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock.quantity"
                  value={formData.stock.quantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stock Unit
                </label>
                <select
                  name="stock.unit"
                  value={formData.stock.unit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="pieces">Pieces</option>
                  <option value="bottles">Bottles</option>
                  <option value="tubes">Tubes</option>
                  <option value="packets">Packets</option>
                </select>
              </div>
            </div>

            {/* Batch and Expiry Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Batch Number *
                </label>
                <input
                  type="text"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., B001, LOT123"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {/* Prescription Required */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="prescriptionRequired"
                checked={formData.prescriptionRequired}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Prescription Required
              </label>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., pain relief, fever, headache"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Medicine Images *
              </label>
              <ImageUpload
                onImagesSelected={setSelectedImages}
                maxImages={5}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Adding Medicine...' : 'Add Medicine'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Section>
  );
};

export default AddMedicine;
