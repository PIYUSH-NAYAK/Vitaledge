import { getIdToken } from '../firebase/auth';

// API utility for making authenticated requests with Firebase tokens
const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:7777';

export const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = await getIdToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Specific API functions
export const getAuthenticatedUser = () => apiRequest('/auth');

export const addProduct = (productData) => 
  apiRequest('/addProduct', {
    method: 'POST',
    body: JSON.stringify(productData),
  });

export const getProducts = (page = 1, limit = 8) => 
  apiRequest(`/getProducts?page=${page}&limit=${limit}`);

export const submitContactForm = (contactData) => 
  apiRequest('/contact', {
    method: 'POST',
    body: JSON.stringify(contactData),
  });
