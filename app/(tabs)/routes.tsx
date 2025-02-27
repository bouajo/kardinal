// app/(tabs)/routes.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

// Define interface for route objects
interface Route {
  id: string;
  route_name: string;
  start_address: string;
  end_address: string;
  status: string;
  total_stops?: number;
  estimated_distance?: number;
  // Add other properties as needed
}

export default function RoutesScreen() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('driver_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setRoutes(data || []);
    } catch (error) {
      console.error('Error fetching routes:', error);
      Alert.alert('Error', 'Failed to load routes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoute = () => {
    // For now, just show alert since the page doesn't exist yet
    Alert.alert('Coming Soon', 'Route creation will be available soon!');
    // Once you create the route creation page, you can uncomment this:
    // router.navigate("/(tabs)/create-route");
  };

  const renderRoute = ({ item }: { item: Route }) => (
    <TouchableOpacity 
      style={styles.routeItem}
      onPress={() => {
        // For now, just show alert since the page doesn't exist yet
        Alert.alert('Route Details', `Details for route: ${item.route_name}`);
        // Once you create the route details page, you can uncomment this:
        // router.navigate(`/(tabs)/route-details/${item.id}`);
      }}
    >
      <ThemedText type="defaultSemiBold">{item.route_name}</ThemedText>
      <ThemedText>{item.start_address} to {item.end_address}</ThemedText>
      <ThemedText>Status: {item.status}</ThemedText>
      <ThemedText>
        Stops: {item.total_stops || 0} • Est. Distance: {Math.round(item.estimated_distance || 0)} km
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">My Routes</ThemedText>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateRoute}>
          <ThemedText style={styles.createButtonText}>Create New</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {loading ? (
        <ThemedView style={styles.centerContent}>
          <ThemedText>Loading routes...</ThemedText>
        </ThemedView>
      ) : routes.length === 0 ? (
        <ThemedView style={styles.centerContent}>
          <ThemedText>No routes found. Create your first route!</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={routes}
          renderItem={renderRoute}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  routeItem: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});