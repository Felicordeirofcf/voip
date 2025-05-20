// Tela de Relatórios para o aplicativo mobile da plataforma VoIP

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
import { Picker } from '@react-native-picker/picker';

// URL base da API
const API_URL = 'https://api.voipplatform.com';

function ReportsScreen() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reports, setReports] = useState([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedType, setSelectedType] = useState('call_usage');

  // Função para carregar relatórios
  const loadReports = async () => {
    try {
      setLoading(true);
      
      // Em uma implementação real, esses dados viriam da API
      // Aqui estamos simulando os dados para demonstração
      
      // Simular relatórios
      const reportsData = [
        { 
          id: 1, 
          name: 'Uso Diário', 
          type: 'call_usage',
          date: '20/05/2025',
          url: 'https://example.com/reports/1'
        },
        { 
          id: 2, 
          name: 'Chamadas por Ramal', 
          type: 'call_usage',
          date: '19/05/2025',
          url: 'https://example.com/reports/2'
        },
        { 
          id: 3, 
          name: 'Performance de Troncos', 
          type: 'performance',
          date: '18/05/2025',
          url: 'https://example.com/reports/3'
        }
      ];
      
      // Simular atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReports(reportsData);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      Alert.alert('Erro', 'Não foi possível carregar os relatórios. Tente novamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadReports();
  }, []);

  // Função para atualizar dados ao puxar para baixo
  const onRefresh = () => {
    setRefreshing(true);
    loadReports();
  };

  // Função para aplicar filtros
  const applyFilters = () => {
    setFilterModalVisible(false);
    // Em uma implementação real, isso recarregaria os relatórios com os filtros
    Alert.alert('Filtros Aplicados', `Período: ${selectedPeriod}, Tipo: ${selectedType}`);
    loadReports();
  };

  // Função para visualizar relatório
  const viewReport = (report) => {
    // Em uma implementação real, isso abriria o relatório
    Alert.alert('Visualizar Relatório', `Nome: ${report.name}\nData: ${report.date}\nURL: ${report.url}`);
  };

  // Renderizar item de relatório
  const renderReportItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.reportCard}
      onPress={() => viewReport(item)}
    >
      <View style={styles.reportInfo}>
        <Text style={styles.reportName}>{item.name}</Text>
        <Text style={styles.reportDate}>{item.date}</Text>
      </View>
      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>Visualizar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Renderizar ícone de tipo de relatório
  const renderTypeIcon = (type) => {
    switch (type) {
      case 'call_usage':
        return <Ionicons name="call" size={20} color="#1976d2" />;
      case 'performance':
        return <Ionicons name="speedometer" size={20} color="#1976d2" />;
      case 'quality':
        return <Ionicons name="stats-chart" size={20} color="#1976d2" />;
      default:
        return <Ionicons name="document" size={20} color="#1976d2" />;
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RELATÓRIOS</Text>
      </View>

      <View style={styles.filterBar}>
        <Text style={styles.filterLabel}>FILTROS</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="options" size={20} color="#1976d2" />
          <Text style={styles.filterButtonText}>Aplicar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={reports}
        renderItem={renderReportItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum relatório disponível</Text>
          </View>
        }
      />

      {/* Modal de Filtros */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.filterCard}>
            <Text style={styles.filterTitle}>FILTROS</Text>
            
            <Text style={styles.filterItemLabel}>Período:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedPeriod}
                onValueChange={(itemValue) => setSelectedPeriod(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Hoje" value="today" />
                <Picker.Item label="Ontem" value="yesterday" />
                <Picker.Item label="Última Semana" value="week" />
                <Picker.Item label="Último Mês" value="month" />
              </Picker>
            </View>
            
            <Text style={styles.filterItemLabel}>Tipo:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedType}
                onValueChange={(itemValue) => setSelectedType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Uso de Chamadas" value="call_usage" />
                <Picker.Item label="Performance" value="performance" />
                <Picker.Item label="Qualidade" value="quality" />
              </Picker>
            </View>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.applyButton]}
                onPress={applyFilters}
              >
                <Text style={styles.applyButtonText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
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
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#e0e0e0',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 5,
  },
  filterButtonText: {
    color: '#1976d2',
    marginLeft: 5,
    fontWeight: '500',
  },
  listContainer: {
    padding: 15,
  },
  reportCard: {
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
  reportInfo: {
    flex: 1,
  },
  reportName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  reportDate: {
    fontSize: 14,
    color: '#666',
  },
  viewButton: {
    backgroundColor: '#e0e0e0',
    padding: 8,
    borderRadius: 5,
  },
  viewButtonText: {
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterCard: {
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
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterItemLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 10,
  },
  applyButton: {
    backgroundColor: '#1976d2',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default ReportsScreen;
