import axios from 'axios';
import { useAppStore } from '@/shared/store/useAppStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAppStore.getState().token;
  console.log('Interceptor Token:', token); // Debugging
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  signup: async (email: string, password: string, name: string) => {
    const response = await api.post('/auth/signup', { email, password, name });
    return response.data;
  },
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
