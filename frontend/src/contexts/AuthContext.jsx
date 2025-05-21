// Contexto de autenticação para o frontend da plataforma VoIP

import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api'; // <-- Substitui axios por API configurada com baseURL do backend

// Criação do contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto de autenticação
export function useAuth() {
  return useContext(AuthContext);
}

// Provedor do contexto de autenticação
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Persistir token localmente
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  // Verificar se o token é válido ao carregar a aplicação
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/api/accounts/users/me/');
        setCurrentUser(response.data);
        setError('');
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        setError('Sessão expirada. Por favor, faça login novamente.');
        logout();
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  // Função de login
  async function login(username, password) {
    try {
      // Garantir que o formato da requisição seja exatamente o que o backend espera
      const loginData = {
        username: username.trim(),
        password: password
      };
      
      console.log('Enviando requisição de login:', loginData);
      
      const response = await api.post('/api/token/', loginData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const { access, refresh } = response.data;

      // Salvar tokens
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      setToken(access);

      // Obter dados do usuário
      const userResponse = await api.get('/api/accounts/users/me/');
      setCurrentUser(userResponse.data);

      setError('');
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError(error.response?.data?.detail || 'Falha ao fazer login. Verifique suas credenciais.');
      return false;
    }
  }

  // Função de logout
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setCurrentUser(null);
  }

  // Função para atualizar o token
  async function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      logout();
      return false;
    }

    try {
      const response = await api.post('/api/token/refresh/', {
        refresh: refreshToken
      });

      const { access } = response.data;
      localStorage.setItem('token', access);
      setToken(access);

      return true;
    } catch (error) {
      console.error('Erro ao atualizar token:', error);
      logout();
      return false;
    }
  }

  // Verificar se o usuário é Super Admin
  function isSuperAdmin() {
    return currentUser?.is_super_admin === true;
  }

  // Verificar se o usuário é Admin de alguma conta
  function isAccountAdmin() {
    return currentUser?.account_memberships?.some(membership => membership.role === 'admin');
  }

  const value = {
    currentUser,
    login,
    logout,
    refreshToken,
    loading,
    error,
    isSuperAdmin,
    isAccountAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}