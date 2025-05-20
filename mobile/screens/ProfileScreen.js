// Tela de Perfil para o aplicativo mobile da plataforma VoIP

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
  Image
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

function ProfileScreen({ navigation }) {
  const { currentUser, logout, isAccountAdmin } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkThemeEnabled, setDarkThemeEnabled] = useState(false);

  // Função para fazer logout
  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Sair',
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  // Função para editar perfil
  const handleEditProfile = () => {
    // Em uma implementação real, isso navegaria para a tela de edição de perfil
    Alert.alert('Editar Perfil', 'Esta funcionalidade será implementada em breve.');
  };

  // Função para alterar senha
  const handleChangePassword = () => {
    // Em uma implementação real, isso navegaria para a tela de alteração de senha
    Alert.alert('Alterar Senha', 'Esta funcionalidade será implementada em breve.');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PERFIL</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {currentUser?.first_name?.charAt(0) || currentUser?.username?.charAt(0) || 'U'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.userName}>
          {currentUser?.first_name ? `${currentUser.first_name} ${currentUser.last_name}` : currentUser?.username}
        </Text>
        
        <Text style={styles.userRole}>
          {isAccountAdmin() ? 'Administrador' : 'Usuário'}
        </Text>
        
        <Text style={styles.userEmail}>
          {currentUser?.email || 'email@exemplo.com'}
        </Text>
        
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleEditProfile}
        >
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>CONFIGURAÇÕES</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Ionicons name="notifications-outline" size={24} color="#666" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Notificações</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#d3d3d3', true: '#81b0ff' }}
            thumbColor={notificationsEnabled ? '#1976d2' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Ionicons name="moon-outline" size={24} color="#666" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Tema Escuro</Text>
          </View>
          <Switch
            value={darkThemeEnabled}
            onValueChange={setDarkThemeEnabled}
            trackColor={{ false: '#d3d3d3', true: '#81b0ff' }}
            thumbColor={darkThemeEnabled ? '#1976d2' : '#f4f3f4'}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.settingButton}
          onPress={handleChangePassword}
        >
          <Ionicons name="key-outline" size={24} color="#666" style={styles.settingIcon} />
          <Text style={styles.settingButtonText}>Alterar Senha</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="#fff" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

      <View style={styles.versionInfo}>
        <Text style={styles.versionText}>Versão 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  profileSection: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  settingsSection: {
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingButtonText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  versionInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  versionText: {
    color: '#999',
    fontSize: 12,
  },
});

export default ProfileScreen;
