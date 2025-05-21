// src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ← será lido da variável no Render
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adiciona o token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // ou sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
