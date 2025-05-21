import React, { useState, useEffect } from 'react';
import { useAuth } from '../../src/contexts/AuthContext.jsx';
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
  Box
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Business as BusinessIcon,
  CallSplit as TrunkIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';

function Dashboard() {
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div style={{ flexGrow: 1 }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Estatísticas Gerais */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ padding: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Estatísticas Gerais
            </Typography>
            <Grid container spacing={3}>
              {isSuperAdmin && (
                <Grid item xs={6} sm={3}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                        <BusinessIcon sx={{ marginRight: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle2" color="text.secondary">
                          Total Contas
                        </Typography>
                      </Box>
                      <Typography variant="h4" sx={{ fontSize: '2rem', fontWeight: 'bold', marginTop: 1 }}>
                        {stats.accounts}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
              
              <Grid item xs={6} sm={3}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                      <PhoneIcon sx={{ marginRight: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        Total Ramais
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontSize: '2rem', fontWeight: 'bold', marginTop: 1 }}>
                      {stats.extensions}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                      <PhoneIcon sx={{ marginRight: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        Chamadas Hoje
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontSize: '2rem', fontWeight: 'bold', marginTop: 1 }}>
                      {stats.callsToday}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                      <TrunkIcon sx={{ marginRight: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        Troncos Ativos
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontSize: '2rem', fontWeight: 'bold', marginTop: 1 }}>
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
          <Paper sx={{ padding: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Atividade Recente
            </Typography>
            <List>
              {recentActivity.map((activity) => (
                <React.Fragment key={activity.id}>
                  <ListItem sx={{ borderLeft: '4px solid', borderColor: 'primary.main', paddingLeft: 2, marginBottom: 1 }}>
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
          <Paper sx={{ padding: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Gráfico de Utilização
            </Typography>
            {chartData ? (
              <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, height: 300 }} />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
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
