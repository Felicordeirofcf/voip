import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../src/contexts/AuthContext.jsx';
import Layout from '../layout/Layout.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Componente que verifica autenticação antes de renderizar rotas protegidas
function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Renderiza um indicador de carregamento enquanto verifica a autenticação
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Se o usuário estiver autenticado, renderiza o componente dentro do layout
  // Caso contrário, redireciona para a página de login
  return currentUser ? (
    <Layout>
      {children}
    </Layout>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default PrivateRoute;
