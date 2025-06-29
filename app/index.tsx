import { databaseService, Task } from '@/services/database';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const router = useRouter();

  const loadTasks = useCallback(async () => {
    const taskList = await databaseService.getAllTasks(showCompleted);
    setTasks(taskList);
  }, [showCompleted]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  useEffect(() => {
    loadTasks();
  }, [showCompleted]);

  const handleToggleTask = async (id: number) => {
    await databaseService.toggleTaskCompletion(id);
    loadTasks();
  };

  const handleLongPress = (task: Task) => {
    Alert.alert(
      'Actions',
      `Que voulez-vous faire avec "${task.title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Modifier', onPress: () => router.push(`/edit-task/${task.id}`) },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => handleDeleteTask(task.id),
        },
      ]
    );
  };

  const handleDeleteTask = async (id: number) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cette tâche ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await databaseService.deleteTask(id);
            loadTasks();
          },
        },
      ]
    );
  };

  const renderTask = ({ item }: { item: Task }) => (
    <Pressable
      style={[styles.taskItem, item.completed && styles.completedTask]}
      onPress={() => handleToggleTask(item.id)}
      onLongPress={() => handleLongPress(item)}
    >
      <View style={styles.taskContent}>
        <View style={styles.taskHeader}>
          <Text style={[styles.taskTitle, item.completed && styles.completedText]}>
            {item.title}
          </Text>
          <Ionicons
            name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={item.completed ? '#4CAF50' : '#666'}
          />
        </View>
        {item.description && (
          <Text style={[styles.taskDescription, item.completed && styles.completedText]}>
            {item.description}
          </Text>
        )}
        <Text style={styles.taskDate}>
          Créé le {new Date(item.createdAt).toLocaleDateString('fr-FR')}
          {item.completedAt && ` • Terminé le ${new Date(item.completedAt).toLocaleDateString('fr-FR')}`}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Afficher les tâches terminées</Text>
          <Switch
            value={showCompleted}
            onValueChange={setShowCompleted}
            trackColor={{ false: '#ddd', true: '#007AFF' }}
            thumbColor={showCompleted ? '#fff' : '#f4f3f4'}
          />
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="settings-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-done-circle-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Aucune tâche trouvée</Text>
            <Text style={styles.emptySubtext}>
              Appuyez sur + pour ajouter votre première tâche
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add-task')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  filterLabel: {
    fontSize: 16,
    marginRight: 12,
    color: '#333',
  },
  settingsButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  taskItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedTask: {
    opacity: 0.7,
    backgroundColor: '#f8f9fa',
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  taskDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});