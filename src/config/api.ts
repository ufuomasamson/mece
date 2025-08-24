// API Configuration for different environments
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    ME: `${API_BASE_URL}/auth/me`,
    SETUP_ADMIN: `${API_BASE_URL}/auth/setup-admin`,
    PROMOTE_TO_ADMIN: `${API_BASE_URL}/auth/promote-to-admin`,
  },
  
  // Content endpoints
  CONTENT: {
    GET_ALL: `${API_BASE_URL}/content`,
    GET_SECTION: (section: string) => `${API_BASE_URL}/content/${section}`,
    UPDATE_SECTION: (section: string) => `${API_BASE_URL}/content/${section}`,
    SAVE_ALL: `${API_BASE_URL}/content`,
  },
  
  // Submission endpoints
  SUBMISSIONS: {
    PARTICIPATE: `${API_BASE_URL}/submissions/participate`,
    CONTACT: `${API_BASE_URL}/submissions/contact`,
    UPDATE_PARTICIPATE: (id: string) => `${API_BASE_URL}/submissions/participate/${id}`,
    UPDATE_CONTACT: (id: string) => `${API_BASE_URL}/submissions/contact/${id}`,
    DELETE_PARTICIPATE: (id: string) => `${API_BASE_URL}/submissions/participate/${id}`,
    DELETE_CONTACT: (id: string) => `${API_BASE_URL}/submissions/contact/${id}`,
  },
  
  // Blog endpoints
  BLOG: {
    GET_ALL: `${API_BASE_URL}/blog`,
    CREATE: `${API_BASE_URL}/blog`,
  },
  
  // Admin endpoints
  ADMIN: {
    PAYSTACK_SETTINGS: `${API_BASE_URL}/admin/paystack-settings`,
    USERS: `${API_BASE_URL}/admin/users`,
    DELETE_USER: (id: string) => `${API_BASE_URL}/admin/users/${id}`,
    SOCIAL_MEDIA: `${API_BASE_URL}/admin/social-media`,
    UPDATE_SOCIAL_MEDIA: `${API_BASE_URL}/admin/social-media`,
  },
  
  // Payment endpoints
  PAYMENTS: {
    INITIALIZE: `${API_BASE_URL}/payments/initialize`,
    VERIFY: `${API_BASE_URL}/payments/verify`,
    GET_DETAILS: (reference: string) => `${API_BASE_URL}/payments/${reference}`,
    GET_ALL: `${API_BASE_URL}/payments`, // Admin only - all payments
    GET_MY: `${API_BASE_URL}/payments/my`, // User's own payments
    CONFIG: `${API_BASE_URL}/payments/config`,
  },

  // Social media endpoints
  SOCIAL_MEDIA: {
    GET_ALL: `${API_BASE_URL}/social-media`,
  },
};

export default API_ENDPOINTS;
