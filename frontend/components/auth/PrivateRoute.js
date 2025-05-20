// Componente de rota privada para o frontend da plataforma VoIP

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../layout/Layout';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

// Componente que verifica autenticação antes de renderizar rotas protegidas
function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser, loading } = useAuth();

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

  return (
    <Route
      {...rest}
      render={props => {
        // Se o usuário estiver autenticado, renderiza o componente dentro do layout
        // Caso contrário, redireciona para a página de login
        return currentUser ? (
          <Layout>
            <Component {...props} />
          </Layout>
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        );
      }}
    />
  );
}

export default PrivateRoute;
