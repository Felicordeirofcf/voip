// Componente de Layout principal para o frontend da plataforma VoIP

import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  AppBar,
  CssBaseline,
  Drawer,
  Hidden,
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
  Box,
  makeStyles
} from '@material-ui/core';
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
} from '@material-ui/icons';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
  avatar: {
    cursor: 'pointer',
    backgroundColor: theme.palette.primary.main,
  },
  userInfo: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  userName: {
    marginTop: theme.spacing(1),
  },
  userRole: {
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
  },
}));

function Layout({ children }) {
  const classes = useStyles();
  const { currentUser, logout, isSuperAdmin } = useAuth();
  const history = useHistory();
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
    history.push('/login');
  };

  const handleProfile = () => {
    handleClose();
    history.push('/settings');
  };

  const navigateTo = (path) => {
    history.push(path);
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
      <div className={classes.userInfo}>
        <Avatar className={classes.avatar}>
          {currentUser?.first_name?.charAt(0) || currentUser?.username?.charAt(0) || 'U'}
        </Avatar>
        <Typography className={classes.userName} variant="subtitle1">
          {currentUser?.first_name ? `${currentUser.first_name} ${currentUser.last_name}` : currentUser?.username}
        </Typography>
        <Typography className={classes.userRole} variant="body2">
          {isSuperAdmin() ? 'Super Administrador' : 'Administrador'}
        </Typography>
      </div>
      <Divider />
      <List>
        {menuItems.map((item) => {
          // Não mostrar itens marcados como adminOnly para não-admins
          if (item.adminOnly && !isSuperAdmin()) {
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
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="abrir menu"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
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
      <nav className={classes.drawer}>
        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Melhor desempenho em dispositivos móveis
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
}

export default Layout;
