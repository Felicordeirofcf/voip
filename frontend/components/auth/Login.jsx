import React, { useState } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Box,
  Snackbar,
  Alert
} from '@mui/material';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const { login, currentUser, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Se o usuário já estiver autenticado, redirecionar para o dashboard
  if (currentUser) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      } else {
        setShowError(true);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper sx={{ 
        marginTop: 8, 
        padding: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }} elevation={3}>
        <Typography component="h1" variant="h5">
          Plataforma VoIP
        </Typography>
        <Box mt={2} mb={3}>
          <Typography variant="subtitle1" align="center">
            Faça login para acessar o sistema
          </Typography>
        </Box>
        
        <Box component="form" sx={{ width: '100%', mt: 1 }} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nome de usuário"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </Box>
      </Paper>
      
      <Snackbar open={showError && !!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Login;
