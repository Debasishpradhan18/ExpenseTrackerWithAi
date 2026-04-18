import api from './api';
import { loginWithGoogle as firebaseLoginWithGoogle } from './firebase';

export const loginWithGoogle = async () => {
  const result = await firebaseLoginWithGoogle();
  const firebaseUser = result.user;
  
  // Send data to our custom backend
  const { data } = await api.post('/auth/google', { 
    email: firebaseUser.email, 
    name: firebaseUser.displayName, 
    uid: firebaseUser.uid 
  });
  
  if (data.token) localStorage.setItem('token', data.token);
  return { user: data };
};

export const loginWithEmail = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  if (data.token) localStorage.setItem('token', data.token);
  return { user: data };
};

export const registerWithEmail = async (email, password, name = '') => {
  const { data } = await api.post('/auth/register', { email, password, name });
  if (data.token) localStorage.setItem('token', data.token);
  return { user: data };
};

export const logout = async () => {
  localStorage.removeItem('token');
  return Promise.resolve();
};

export const getUserToken = () => {
  return localStorage.getItem('token');
};

export const getCurrentUser = () => {
  // We can decode JWT here or just fetch from local storage if we stored user info
  return localStorage.getItem('token') ? { email: 'user' } : null; 
};
