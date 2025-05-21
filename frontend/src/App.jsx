import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Componentes de autenticação
import Login from '../components/auth/Login.jsx';
import PrivateRoute from '../components/auth/PrivateRoute';

// Componentes de layout
import Dashboard from '../components/dashboard/Dashboard.jsx';
import Accounts from '../components/accounts/Accounts.jsx';
import Extensions from '../components/extensions/Extensions';
import Trunks from '../components/trunks/Trunks';
import Monitoring from '../components/monitoring/Monitoring';
import Reports from '../components/reports/Reports';
import Settings from '../components/settings/Settings';
// Contexto de autenticação
import { AuthProvider } from './contexts/AuthContext.jsx';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: ['Roboto', 'Arial', 'sans-serif'].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/accounts" element={<PrivateRoute><Accounts /></PrivateRoute>} />
            <Route path="/extensions" element={<PrivateRoute><Extensions /></PrivateRoute>} />
            <Route path="/trunks" element={<PrivateRoute><Trunks /></PrivateRoute>} />
            <Route path="/monitoring" element={<PrivateRoute><Monitoring /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
