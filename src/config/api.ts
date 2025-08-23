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
    DELETE_PARTICIPATE: (id: string) => `${API_BASE_URL}/api/submissions/participate/${id}`,
    DELETE_CONTACT: (id: string) => `${API_BASE_URL}/api/submissions/contact/${id}`,
  },
  
  // Blog endpoints
  BLOG: {
    GET_ALL: `${API_BASE_URL}/api/blog`,
    CREATE: `${API_BASE_URL}/api/blog`,
  },
  
  // Admin endpoints
  ADMIN: {
    PAYSTACK_SETTINGS: `${API_BASE_URL}/api/admin/paystack-settings`,
    USERS: `${API_BASE_URL}/api/admin/users`,
    DELETE_USER: (id: string) => `${API_BASE_URL}/api/admin/users/${id}`,
    SOCIAL_MEDIA: `${API_BASE_URL}/api/admin/social-media`,
    UPDATE_SOCIAL_MEDIA: (id: string) => `${API_BASE_URL}/api/admin/social-media/${id}`,
  },
  
  // Payment endpoints
  PAYMENTS: {
    INITIALIZE: `${API_BASE_URL}/api/payments/initialize`,
    VERIFY: `${API_BASE_URL}/api/payments/verify`,
    GET_DETAILS: (reference: string) => `${API_BASE_URL}/api/payments/${reference}`,
    GET_ALL: `${API_BASE_URL}/api/payments`, // Admin only - all payments
    GET_MY: `${API_BASE_URL}/api/payments/my`, // User's own payments
    CONFIG: `${API_BASE_URL}/api/payments/config`,
  },

  // Social media endpoints
  SOCIAL_MEDIA: {
    GET_ALL: `${API_BASE_URL}/api/social-media`,
  },
};

export default API_ENDPOINTS;
