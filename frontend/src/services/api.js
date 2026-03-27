import axios from 'axios';
import { auth, isDemoMode } from './firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Interceptor to add Firebase Auth Token to requests
api.interceptors.request.use(async (config) => {
  if (isDemoMode) {
    config.headers.Authorization = `Bearer demo-token`;
  } else if (auth?.currentUser) {
    const token = await auth.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
