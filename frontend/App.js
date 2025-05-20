// Estrutura base do frontend React para a plataforma VoIP

import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

// Componentes de autenticação
import Login from './components/auth/Login';
import PrivateRoute from './components/auth/PrivateRoute';

// Componentes de layout
import Dashboard from './components/dashboard/Dashboard';
import Accounts from './components/accounts/Accounts';
import Extensions from './components/extensions/Extensions';
import Trunks from './components/trunks/Trunks';
import Monitoring from './components/monitoring/Monitoring';
import Reports from './components/reports/Reports';
import Settings from './components/settings/Settings';

// Contexto de autenticação
import { AuthProvider } from './contexts/AuthContext';

// Tema da aplicação
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Switch>
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute path="/accounts" component={Accounts} />
            <PrivateRoute path="/extensions" component={Extensions} />
            <PrivateRoute path="/trunks" component={Trunks} />
            <PrivateRoute path="/monitoring" component={Monitoring} />
            <PrivateRoute path="/reports" component={Reports} />
            <PrivateRoute path="/settings" component={Settings} />
            <Redirect to="/" />
          </Switch>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
