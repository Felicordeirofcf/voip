// Tela de Monitoramento de Chamadas para o aplicativo mobile da plataforma VoIP

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';

// URL base da API
const API_URL = 'https://api.voipplatform.com';

function CallsScreen() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCalls, setActiveCalls] = useState([]);
  const [recentCalls, setRecentCalls] = useState([]);
  const [monitoringCall, setMonitoringCall] = useState(null);
  const [monitoringVisible, setMonitoringVisible] = useState(false);
  const [volume, setVolume] = useState(0.5);

  // Função para carregar chamadas
  const loadCalls = async () => {
    try {
      setLoading(true);
      
      // Em uma implementação real, esses dados viriam da API
      // Aqui estamos simulando os dados para demonstração
      
      // Simular chamadas ativas
      const activeCallsData = [
        { 
          id: 1, 
          origin: 'Ramal 1001', 
          destination: 'Externo', 
          duration: '02:34',
          status: 'active'
        },
        { 
          id: 2, 
          origin: 'Externo', 
          destination: 'Ramal 1002', 
          duration: '01:15',
          status: 'active'
        }
      ];
      
      // Simular chamadas recentes
      const recentCallsData = [
        { 
          id: 3, 
          origin: 'Ramal 1001', 
          destination: 'Externo', 
          duration: '03:22',
          time: '14:30',
          status: 'completed'
        },
        { 
          id: 4, 
          origin: 'Externo', 
          destination: 'Ramal 1002', 
          duration: '01:45',
          time: '14:15',
          status: 'completed'
        },
        { 
          id: 5, 
          origin: 'Ramal 2001', 
          destination: 'Ramal 2002', 
          duration: '00:30',
          time: '14:00',
          status: 'missed'
        }
      ];
      
      // Simular atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setActiveCalls(activeCallsData);
      setRecentCalls(recentCallsData);
    } catch (error) {
      console.error('Erro ao carregar chamadas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as chamadas. Tente novamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadCalls();
  }, []);

  // Função para atualizar dados ao puxar para baixo
  const onRefresh = () => {
    setRefreshing(true);
    loadCalls();
  };

  // Função para iniciar monitoramento de chamada
  const startMonitoring = (call) => {
    setMonitoringCall(call);
    setMonitoringVisible(true);
  };

  // Função para encerrar monitoramento
  const stopMonitoring = () => {
    setMonitoringVisible(false);
    setMonitoringCall(null);
  };

  // Renderizar item de chamada ativa
  const renderActiveCallItem = ({ item }) => (
    <View style={styles.callCard}>
      <View style={styles.callInfo}>
        <Text style={styles.callDirection}>{item.origin} → {item.destination}</Text>
        <Text style={styles.callDuration}>Duração: {item.duration}</Text>
      </View>
      <TouchableOpacity 
        style={styles.listenButton}
        onPress={() => startMonitoring(item)}
      >
        <Ionicons name="headset" size={20} color="#fff" />
        <Text style={styles.listenButtonText}>Escutar</Text>
      </TouchableOpacity>
    </View>
  );

  // Renderizar item de chamada recente
  const renderRecentCallItem = ({ item }) => (
    <View style={[styles.callCard, styles.recentCallCard]}>
      <View style={styles.callInfo}>
        <Text style={styles.callDirection}>{item.origin} → {item.destination}</Text>
        <View style={styles.callDetails}>
          <Text style={styles.callTime}>{item.time}</Text>
          <Text style={[
            styles.callStatus, 
            item.status === 'completed' ? styles.completedStatus : styles.missedStatus
          ]}>
            {item.status === 'completed' ? 'Finalizada' : 'Perdida'}
          </Text>
          <Text style={styles.callDuration}>{item.duration}</Text>
        </View>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CHAMADAS ATIVAS</Text>
      </View>

      <FlatList
        data={activeCalls}
        renderItem={renderActiveCallItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma chamada ativa no momento</Text>
          </View>
        }
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>HISTÓRICO DE CHAMADAS</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>Ver Completo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recentCalls}
        renderItem={renderRecentCallItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma chamada recente</Text>
          </View>
        }
      />

      {/* Modal de Monitoramento de Chamada */}
      <Modal
        visible={monitoringVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={stopMonitoring}
      >
        <View style={styles.modalContainer}>
          <View style={styles.monitoringCard}>
            <Text style={styles.monitoringTitle}>ESCUTA DE CHAMADA</Text>
            
            <View style={styles.callDetails}>
              <Text style={styles.monitoringLabel}>Origem:</Text>
              <Text style={styles.monitoringValue}>{monitoringCall?.origin}</Text>
            </View>
            
            <View style={styles.callDetails}>
              <Text style={styles.monitoringLabel}>Destino:</Text>
              <Text style={styles.monitoringValue}>{monitoringCall?.destination}</Text>
            </View>
            
            <View style={styles.callDetails}>
              <Text style={styles.monitoringLabel}>Duração:</Text>
              <Text style={styles.monitoringValue}>{monitoringCall?.duration}</Text>
            </View>
            
            <View style={styles.audioIndicator}>
              <Ionicons name="volume-high" size={24} color="#1976d2" />
              <Text style={styles.audioStatus}>Áudio ativo</Text>
            </View>
            
            <Text style={styles.volumeLabel}>Volume:</Text>
            <Slider
              style={styles.volumeSlider}
              minimumValue={0}
              maximumValue={1}
              value={volume}
              onValueChange={setVolume}
              minimumTrackTintColor="#1976d2"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#1976d2"
            />
            
            <TouchableOpacity 
              style={styles.stopButton}
              onPress={stopMonitoring}
            >
              <Text style={styles.stopButtonText}>Encerrar Escuta</Text>
            </TouchableOpacity>
            
            <Text style={styles.monitoringNote}>
              Nota: Esta chamada está sendo monitorada apenas para fins de qualidade.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContainer: {
    padding: 15,
  },
  callCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  recentCallCard: {
    backgroundColor: '#f9f9f9',
  },
  callInfo: {
    flex: 1,
  },
  callDirection: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  callDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callDuration: {
    fontSize: 14,
    color: '#666',
  },
  callTime: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  callStatus: {
    fontSize: 14,
    marginRight: 10,
  },
  completedStatus: {
    color: '#4caf50',
  },
  missedStatus: {
    color: '#f44336',
  },
  listenButton: {
    backgroundColor: '#1976d2',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
  },
  listenButtonText: {
    color: '#fff',
    marginLeft: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  viewAllText: {
    color: '#1976d2',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  monitoringCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  monitoringTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  monitoringLabel: {
    fontSize: 14,
    color: '#666',
    width: 70,
  },
  monitoringValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  audioIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  audioStatus: {
    marginLeft: 10,
    color: '#1976d2',
    fontWeight: '500',
  },
  volumeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  volumeSlider: {
    width: '100%',
    height: 40,
  },
  stopButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  stopButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  monitoringNote: {
    fontSize: 12,
    color: '#999',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default CallsScreen;
