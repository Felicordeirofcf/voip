// Contexto de autenticação para o aplicativo mobile da plataforma VoIP

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// URL base da API
const API_URL = 'https://api.voipplatform.com';

// Criação do contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto de autenticação
export function useAuth() {
  return useContext(AuthContext);
}

// Provedor do contexto de autenticação
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Carregar token salvo ao iniciar o aplicativo
  useEffect(() => {
    async function loadToken() {
      try {
        const savedToken = await AsyncStorage.getItem('token');
        if (savedToken) {
          setToken(savedToken);
          axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        }
      } catch (error) {
        console.error('Erro ao carregar token:', error);
      } finally {
        setLoading(false);
      }
    }

    loadToken();
  }, []);

  // Verificar se o token é válido e carregar dados do usuário
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verificar token e obter dados do usuário
        const response = await axios.get(`${API_URL}/api/accounts/users/me/`);
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

    if (token) {
      loadUser();
    }
  }, [token]);

  // Função de login
  async function login(username, password) {
    try {
      const response = await axios.post(`${API_URL}/api/token/`, {
        username,
        password
      });

      const { access, refresh } = response.data;
      
      // Salvar tokens
      await AsyncStorage.setItem('token', access);
      await AsyncStorage.setItem('refreshToken', refresh);
      
      setToken(access);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      // Obter dados do usuário
      const userResponse = await axios.get(`${API_URL}/api/accounts/users/me/`);
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
  async function logout() {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      setToken(null);
      setCurrentUser(null);
      delete axios.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  // Função para atualizar o token
  async function refreshToken() {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        logout();
        return false;
      }

      const response = await axios.post(`${API_URL}/api/token/refresh/`, {
        refresh: refreshToken
      });

      const { access } = response.data;
      await AsyncStorage.setItem('token', access);
      setToken(access);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar token:', error);
      logout();
      return false;
    }
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
    isAccountAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
