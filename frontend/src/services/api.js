// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://voip-platform-backend.onrender.com', // substitua pela URL real do backend
});

// Adiciona automaticamente o token em cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
