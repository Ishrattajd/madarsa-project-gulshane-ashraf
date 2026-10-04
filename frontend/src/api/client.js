/**
 * Axios instance pre-configured for the Django backend.
 * The Vite dev proxy maps /api → http://localhost:8000,
 * so no base URL change is needed between dev and prod build
 * (set VITE_API_BASE_URL in .env for production if needed).
 */

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT access token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('madarsa_access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, clear stored tokens so admin is redirected to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('madarsa_access');
      localStorage.removeItem('madarsa_refresh');
    }
    return Promise.reject(err);
  }
);

export default api;
