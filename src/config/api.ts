// API Configuration for different environments
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    ME: `${API_BASE_URL}/api/auth/me`,
    SETUP_ADMIN: `${API_BASE_URL}/api/auth/setup-admin`,
    PROMOTE_TO_ADMIN: `${API_BASE_URL}/api/auth/promote-to-admin`,
  },
  
  // Content endpoints
  CONTENT: {
    GET_ALL: `${API_BASE_URL}/api/content`,
    GET_SECTION: (section: string) => `${API_BASE_URL}/api/content/${section}`,
    UPDATE_SECTION: (section: string) => `${API_BASE_URL}/api/content/${section}`,
    SAVE_ALL: `${API_BASE_URL}/api/content`,
  },
  
  // Submission endpoints
  SUBMISSIONS: {
    PARTICIPATE: `${API_BASE_URL}/api/submissions/participate`,
    CONTACT: `${API_BASE_URL}/api/submissions/contact`,
    UPDATE_PARTICIPATE: (id: string) => `${API_BASE_URL}/api/submissions/participate/${id}`,
    UPDATE_CONTACT: (id: string) => `${API_BASE_URL}/api/submissions/contact/${id}`,
  },
  
  // Blog endpoints
  BLOG: {
    GET_ALL: `${API_BASE_URL}/api/blog`,
    CREATE: `${API_BASE_URL}/api/blog`,
  },
  
  // Admin endpoints
  ADMIN: {
    PAYSTACK_SETTINGS: `${API_BASE_URL}/api/admin/paystack-settings`,
  },
  
  // Payment endpoints
  PAYMENTS: {
    INITIALIZE: `${API_BASE_URL}/api/payments/initialize`,
    VERIFY: `${API_BASE_URL}/api/payments/verify`,
    GET_DETAILS: (reference: string) => `${API_BASE_URL}/api/payments/${reference}`,
    GET_ALL: `${API_BASE_URL}/api/payments`,
    CONFIG: `${API_BASE_URL}/api/payments/config`,
  },
};

export default API_ENDPOINTS;
