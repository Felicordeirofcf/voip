import axios from 'axios';

const api = axios.create({
  baseURL: 'https://voip-platform-backend.onrender.com', // <- URL correta do backend
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
