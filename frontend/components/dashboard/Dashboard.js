// Componente Dashboard para o frontend da plataforma VoIP

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Box,
  makeStyles
} from '@material-ui/core';
import {
  Phone as PhoneIcon,
  Business as BusinessIcon,
  CallSplit as TrunkIcon,
  Warning as WarningIcon
} from '@material-ui/icons';
import { Line } from 'react-chartjs-2';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    height: '100%',
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flexGrow: 1,
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginTop: theme.spacing(1),
  },
  statLabel: {
    color: theme.palette.text.secondary,
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  warningIcon: {
    color: theme.palette.warning.main,
    marginRight: theme.spacing(1),
  },
  activityItem: {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    paddingLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
}));

function Dashboard() {
  const classes = useStyles();
  const { currentUser, isSuperAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    accounts: 0,
    extensions: 0,
    trunks: 0,
    activeCalls: 0,
    callsToday: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Função para carregar dados do dashboard
    async function loadDashboardData() {
      setLoading(true);
      try {
        // Em uma implementação real, esses dados viriam da API
        // Aqui estamos simulando os dados para demonstração
        
        // Simular estatísticas
        const statsData = {
          accounts: 24,
          extensions: 342,
          trunks: 36,
          activeCalls: 15,
          callsToday: 1245,
        };
        
        // Simular atividades recentes
        const activityData = [
          { id: 1, type: 'account', message: 'Nova conta criada: Empresa XYZ', timestamp: '14:30' },
          { id: 2, type: 'admin', message: 'Novo admin adicionado: João Silva', timestamp: '13:45' },
          { id: 3, type: 'extension', message: '20 novos ramais criados para Empresa ABC', timestamp: '12:20' },
          { id: 4, type: 'trunk', message: 'Alerta: Tronco SIP offline para Empresa DEF', timestamp: '11:15' },
          { id: 5, type: 'call', message: 'Pico de chamadas detectado: 45 chamadas/min', timestamp: '10:30' },
        ];
        
        // Simular dados do gráfico
        const labels = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
        const chartData = {
          labels,
          datasets: [
            {
              label: 'Chamadas',
              data: [65, 78, 90, 81, 56, 85, 120, 95],
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }
          ]
        };
        
        setStats(statsData);
        setRecentActivity(activityData);
        setChartData(chartData);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <Box className={classes.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Estatísticas Gerais */}
        <Grid item xs={12} md={8}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Estatísticas Gerais
            </Typography>
            <Grid container spacing={3}>
              {isSuperAdmin() && (
                <Grid item xs={6} sm={3}>
                  <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <div className={classes.iconContainer}>
                        <BusinessIcon className={classes.icon} />
                        <Typography variant="subtitle2" className={classes.statLabel}>
                          Total Contas
                        </Typography>
                      </div>
                      <Typography variant="h4" className={classes.statValue}>
                        {stats.accounts}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
              
              <Grid item xs={6} sm={3}>
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <div className={classes.iconContainer}>
                      <PhoneIcon className={classes.icon} />
                      <Typography variant="subtitle2" className={classes.statLabel}>
                        Total Ramais
                      </Typography>
                    </div>
                    <Typography variant="h4" className={classes.statValue}>
                      {stats.extensions}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <div className={classes.iconContainer}>
                      <PhoneIcon className={classes.icon} />
                      <Typography variant="subtitle2" className={classes.statLabel}>
                        Chamadas Hoje
                      </Typography>
                    </div>
                    <Typography variant="h4" className={classes.statValue}>
                      {stats.callsToday}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <div className={classes.iconContainer}>
                      <TrunkIcon className={classes.icon} />
                      <Typography variant="subtitle2" className={classes.statLabel}>
                        Troncos Ativos
                      </Typography>
                    </div>
                    <Typography variant="h4" className={classes.statValue}>
                      {stats.trunks}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Atividade Recente */}
        <Grid item xs={12} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Atividade Recente
            </Typography>
            <List>
              {recentActivity.map((activity) => (
                <React.Fragment key={activity.id}>
                  <ListItem className={classes.activityItem}>
                    <ListItemText
                      primary={activity.message}
                      secondary={activity.timestamp}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        
        {/* Gráfico de Utilização */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Gráfico de Utilização
            </Typography>
            {chartData ? (
              <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, height: 300 }} />
            ) : (
              <Box className={classes.loadingContainer}>
                <CircularProgress />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
