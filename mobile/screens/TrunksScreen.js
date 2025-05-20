// Tela de Troncos SIP para o aplicativo mobile da plataforma VoIP

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

// URL base da API
const API_URL = 'https://api.voipplatform.com';

function TrunksScreen({ navigation }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [trunks, setTrunks] = useState([]);

  // Função para carregar troncos SIP
  const loadTrunks = async () => {
    try {
      setLoading(true);
      
      // Em uma implementação real, esses dados viriam da API
      // Aqui estamos simulando os dados para demonstração
      
      // Simular troncos SIP
      const trunksData = [
        { 
          id: 1, 
          name: 'Tronco 1', 
          status: 'active', 
          host: 'sip.provedor1.com',
          username: 'user123',
          last_activity: '2025-05-20T14:30:00Z'
        },
        { 
          id: 2, 
          name: 'Tronco 2', 
          status: 'inactive', 
          host: 'sip.provedor2.com',
          username: 'user456',
          last_activity: '2025-05-19T10:15:00Z'
        },
        { 
          id: 3, 
          name: 'Tronco 3', 
          status: 'error', 
          host: 'sip.provedor3.com',
          username: 'user789',
          last_activity: '2025-05-18T08:45:00Z'
        }
      ];
      
      // Simular atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTrunks(trunksData);
    } catch (error) {
      console.error('Erro ao carregar troncos SIP:', error);
      Alert.alert('Erro', 'Não foi possível carregar os troncos SIP. Tente novamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadTrunks();
  }, []);

  // Função para atualizar dados ao puxar para baixo
  const onRefresh = () => {
    setRefreshing(true);
    loadTrunks();
  };

  // Função para testar conexão do tronco
  const testConnection = (trunkId) => {
    Alert.alert(
      'Testar Conexão',
      'Deseja testar a conexão deste tronco SIP?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Testar',
          onPress: async () => {
            try {
              // Em uma implementação real, isso chamaria a API
              Alert.alert('Sucesso', 'Conexão estabelecida com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Falha ao testar conexão. Tente novamente.');
            }
          }
        }
      ]
    );
  };

  // Função para navegar para detalhes do tronco
  const viewTrunkDetails = (trunk) => {
    // Em uma implementação real, isso navegaria para a tela de detalhes
    Alert.alert('Detalhes do Tronco', `Nome: ${trunk.name}\nHost: ${trunk.host}\nStatus: ${trunk.status}`);
  };

  // Renderizar ícone de status
  const renderStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Ionicons name="checkmark-circle" size={24} color="#4caf50" />;
      case 'inactive':
        return <Ionicons name="pause-circle" size={24} color="#ff9800" />;
      case 'error':
        return <Ionicons name="alert-circle" size={24} color="#f44336" />;
      default:
        return <Ionicons name="help-circle" size={24} color="#9e9e9e" />;
    }
  };

  // Renderizar item da lista
  const renderTrunkItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.trunkCard}
      onPress={() => viewTrunkDetails(item)}
    >
      <View style={styles.trunkHeader}>
        <Text style={styles.trunkName}>{item.name}</Text>
        {renderStatusIcon(item.status)}
      </View>
      
      <View style={styles.trunkInfo}>
        <Text style={styles.trunkHost}>{item.host}</Text>
        <Text style={styles.trunkStatus}>
          Status: {item.status === 'active' ? 'Ativo' : item.status === 'inactive' ? 'Inativo' : 'Erro'}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.testButton}
        onPress={() => testConnection(item.id)}
      >
        <Text style={styles.testButtonText}>Testar Conexão</Text>
      </TouchableOpacity>
    </TouchableOpacity>
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
        <Text style={styles.headerTitle}>TRONCOS SIP</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Configurar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={trunks}
        renderItem={renderTrunkItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum tronco SIP encontrado</Text>
          </View>
        }
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1976d2',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '500',
  },
  listContainer: {
    padding: 15,
  },
  trunkCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  trunkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  trunkName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  trunkInfo: {
    marginBottom: 15,
  },
  trunkHost: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  trunkStatus: {
    fontSize: 14,
    color: '#666',
  },
  testButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
});

export default TrunksScreen;
