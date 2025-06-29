import { databaseService } from "@/services/database";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    databaseService.init();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Mes Tâches' }} />
      <Stack.Screen name="add-task" options={{ title: 'Nouvelle Tâche' }} />
      <Stack.Screen name="edit-task/[id]" options={{ title: 'Modifier Tâche' }} />
      <Stack.Screen name="settings" options={{ title: 'Paramètres' }} />
    </Stack>
  );
}