import { databaseService } from '@/services/database';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationsEnabled, setConfirmationsEnabled] = useState(true);

  const handleResetDatabase = () => {
    if (confirmationsEnabled) {
      Alert.alert(
        'Confirmer la réinitialisation',
        'Cette action supprimera toutes vos tâches de manière définitive. Êtes-vous sûr de vouloir continuer ?',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Réinitialiser',
            style: 'destructive',
            onPress: performResetDatabase,
          },
        ]
      );
    } else {
      performResetDatabase();
    }
  };

  const performResetDatabase = async () => {
    setIsLoading(true);
    try {
      await databaseService.resetDatabase();
      Alert.alert('Succès', 'La base de données a été réinitialisée avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de réinitialiser la base de données');
      console.error('Error resetting database:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertTestData = () => {
    if (confirmationsEnabled) {
      Alert.alert(
        'Insérer des données de test',
        'Cette action ajoutera 5 tâches fictives à votre liste. Continuer ?',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Ajouter',
            onPress: performInsertTestData,
          },
        ]
      );
    } else {
      performInsertTestData();
    }
  };

  const performInsertTestData = async () => {
    setIsLoading(true);
    try {
      await databaseService.insertTestData();
      Alert.alert('Succès', '5 tâches de test ont été ajoutées à votre liste');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter les données de test');
      console.error('Error inserting test data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const SettingItem = ({ 
    title, 
    subtitle, 
    onPress, 
    icon, 
    iconColor = '#007AFF', 
    danger = false,
    disabled = false 
  }: {
    title: string;
    subtitle?: string;
    onPress: () => void;
    icon: string;
    iconColor?: string;
    danger?: boolean;
    disabled?: boolean;
  }) => (
    <TouchableOpacity 
      style={[styles.settingItem, disabled && styles.disabledItem]} 
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.settingIcon}>
        <Ionicons 
          name={icon as any} 
          size={24} 
          color={disabled ? '#ccc' : (danger ? '#ff6b6b' : iconColor)} 
        />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, danger && styles.dangerText, disabled && styles.disabledText]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, disabled && styles.disabledText]}>
            {subtitle}
          </Text>
        )}
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={disabled ? '#ccc' : '#c7c7cc'} 
      />
    </TouchableOpacity>
  );

  const SettingSectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        
        <SettingSectionHeader title="Préférences" />
        <View style={styles.section}>
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#007AFF" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Confirmations</Text>
              <Text style={styles.settingSubtitle}>
                Demander confirmation avant les actions importantes
              </Text>
            </View>
            <Switch
              value={confirmationsEnabled}
              onValueChange={setConfirmationsEnabled}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
              thumbColor={confirmationsEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        <SettingSectionHeader title="Données" />
        <View style={styles.section}>
          <SettingItem
            title="Ajouter des tâches de test"
            subtitle="Insérer 5 tâches fictives pour tester l'application"
            onPress={handleInsertTestData}
            icon="flask-outline"
            iconColor="#4CAF50"
            disabled={isLoading}
          />
          
          <View style={styles.separator} />
          
          <SettingItem
            title="Réinitialiser la base de données"
            subtitle="Supprimer toutes les tâches de manière définitive"
            onPress={handleResetDatabase}
            icon="trash-outline"
            danger
            disabled={isLoading}
          />
        </View>

        <SettingSectionHeader title="À propos" />
        <View style={styles.section}>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutTitle}>Application de Tâches</Text>
            <Text style={styles.aboutVersion}>Version 1.0.0</Text>
            <Text style={styles.aboutDescription}>
              Une application simple et élégante pour gérer vos tâches quotidiennes. 
              Développée avec React Native et Expo Router.
            </Text>
          </View>
        </View>

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Traitement en cours...</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 60,
  },
  disabledItem: {
    opacity: 0.5,
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  dangerText: {
    color: '#ff6b6b',
  },
  disabledText: {
    color: '#ccc',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 68,
  },
  aboutItem: {
    padding: 20,
    alignItems: 'center',
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  aboutDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
});