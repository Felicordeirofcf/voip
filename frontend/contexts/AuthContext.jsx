// Contexto de autenticação para o frontend da plataforma VoIP

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

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

  // Configurar o axios para incluir o token em todas as requisições
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
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
        // Verificar token e obter dados do usuário
        const response = await axios.get('/api/accounts/users/me/');
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
      const response = await axios.post('/api/token/', {
        username,
        password
      });

      const { access, refresh } = response.data;
      
      // Salvar tokens
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      
      setToken(access);
      
      // Obter dados do usuário
      const userResponse = await axios.get('/api/accounts/users/me/');
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
      const response = await axios.post('/api/token/refresh/', {
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
    // Esta função precisaria verificar as contas do usuário
    // Em uma implementação real, isso viria dos dados do usuário
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
