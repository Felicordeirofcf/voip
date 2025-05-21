// src/services/api.js
import axios from 'axios';

// Garantir que a baseURL esteja completa e correta
const baseURL = 'https://voip-platform-backend.onrender.com';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Adiciona automaticamente o token em cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Garantir que a URL esteja sendo formada corretamente
  if (!config.url.startsWith('http')) {
    // Se a URL não começar com http, garantir que comece com /
    if (!config.url.startsWith('/')) {
      config.url = '/' + config.url;
    }
  }
  
  return config;
});

export default api;
