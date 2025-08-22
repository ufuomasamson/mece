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
  
  // Payment endpoints
  PAYMENTS: {
    CREATE_INTENT: `${API_BASE_URL}/api/payments/create-intent`,
    CONFIRM: `${API_BASE_URL}/api/payments/confirm`,
    GET_DETAILS: (id: string) => `${API_BASE_URL}/api/payments/${id}`,
    GET_ALL: `${API_BASE_URL}/api/payments`,
  },
};

export default API_ENDPOINTS;
