// Tela de Dashboard para o aplicativo mobile da plataforma VoIP

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

// URL base da API
const API_URL = 'https://api.voipplatform.com';

function DashboardScreen() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    ramaisAtivos: 0,
    chamadasHoje: 0,
    troncosAtivos: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  // Função para carregar dados do dashboard
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Em uma implementação real, esses dados viriam da API
      // Aqui estamos simulando os dados para demonstração
      
      // Simular estatísticas
      const statsData = {
        ramaisAtivos: 24,
        chamadasHoje: 156,
        troncosAtivos: 3
      };
      
      // Simular atividades recentes
      const activityData = [
        { id: 1, type: 'call', message: 'Chamada: 1001 → Externo', timestamp: '14:30' },
        { id: 2, type: 'trunk', message: 'Tronco SIP1 atualizado', timestamp: '13:45' },
        { id: 3, type: 'report', message: 'Novo relatório gerado', timestamp: '12:20' },
        { id: 4, type: 'call', message: 'Chamada perdida: Externo → 1002', timestamp: '11:15' },
      ];
      
      // Simular atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats(statsData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Função para atualizar dados ao puxar para baixo
  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  // Renderizar ícone com base no tipo de atividade
  const renderActivityIcon = (type) => {
    switch (type) {
      case 'call':
        return <Ionicons name="call-outline" size={24} color="#1976d2" />;
      case 'trunk':
        return <Ionicons name="git-branch-outline" size={24} color="#1976d2" />;
      case 'report':
        return <Ionicons name="document-text-outline" size={24} color="#1976d2" />;
      default:
        return <Ionicons name="information-circle-outline" size={24} color="#1976d2" />;
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {currentUser?.first_name || currentUser?.username}</Text>
        <Text style={styles.subGreeting}>{currentUser?.account_name || 'Bem-vindo à Plataforma VoIP'}</Text>
      </View>

      <Text style={styles.sectionTitle}>RESUMO</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.ramaisAtivos}</Text>
          <Text style={styles.statLabel}>Ramais Ativos</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.chamadasHoje}</Text>
          <Text style={styles.statLabel}>Chamadas Hoje</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.troncosAtivos}</Text>
          <Text style={styles.statLabel}>Troncos Ativos</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>ATIVIDADE RECENTE</Text>
      <View style={styles.activityContainer}>
        {recentActivity.map(activity => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityIconContainer}>
              {renderActivityIcon(activity.type)}
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityMessage}>{activity.message}</Text>
              <Text style={styles.activityTime}>{activity.timestamp}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.viewMoreButton}>
        <Text style={styles.viewMoreText}>Ver mais atividades</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#1976d2',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subGreeting: {
    fontSize: 16,
    color: '#e0e0e0',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  activityContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIconContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 3,
  },
  viewMoreButton: {
    alignItems: 'center',
    padding: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  viewMoreText: {
    color: '#1976d2',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default DashboardScreen;
