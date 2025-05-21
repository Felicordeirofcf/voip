import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../src/contexts/AuthContext.jsx';
import {
  AppBar,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Menu,
  MenuItem,
  Avatar,
  Box
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  PhoneInTalk as PhoneIcon,
  CallSplit as TrunkIcon,
  Visibility as MonitoringIcon,
  Assessment as ReportIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  AccountCircle
} from '@mui/icons-material';

const drawerWidth = 240;

function Layout({ children }) {
  const { currentUser, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/settings');
  };

  const navigateTo = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  // Definir itens do menu com base no papel do usuário
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Contas', icon: <BusinessIcon />, path: '/accounts', adminOnly: true },
    { text: 'Ramais', icon: <PhoneIcon />, path: '/extensions' },
    { text: 'Troncos SIP', icon: <TrunkIcon />, path: '/trunks' },
    { text: 'Monitoramento', icon: <MonitoringIcon />, path: '/monitoring' },
    { text: 'Relatórios', icon: <ReportIcon />, path: '/reports' },
    { text: 'Configurações', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawer = (
    <div>
      <Box sx={{ 
        padding: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <Avatar sx={{ 
          cursor: 'pointer', 
          bgcolor: 'primary.main' 
        }}>
          {currentUser?.first_name?.charAt(0) || currentUser?.username?.charAt(0) || 'U'}
        </Avatar>
        <Typography sx={{ marginTop: 1 }} variant="subtitle1">
          {currentUser?.first_name ? `${currentUser.first_name} ${currentUser.last_name}` : currentUser?.username}
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }} variant="body2">
          {isSuperAdmin ? 'Super Administrador' : 'Administrador'}
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => {
          // Não mostrar itens marcados como adminOnly para não-admins
          if (item.adminOnly && !isSuperAdmin) {
            return null;
          }
          
          return (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => navigateTo(item.path)}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Sair" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="abrir menu"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              marginRight: 2, 
              display: { md: 'none' } 
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Plataforma VoIP
          </Typography>
          <div>
            <IconButton
              aria-label="conta do usuário"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>Meu Perfil</MenuItem>
              <MenuItem onClick={handleLogout}>Sair</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ 
          width: { md: drawerWidth }, 
          flexShrink: { md: 0 } 
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth 
            },
          }}
          ModalProps={{
            keepMounted: true, // Melhor desempenho em dispositivos móveis
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth 
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          padding: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` } 
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
