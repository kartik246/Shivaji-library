import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  withCredentials: true, // Send httpOnly cookies with all requests
});

// Intercept requests to attach token from localStorage as fallback if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shivaji_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
