import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, FlatList, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Collapsible } from '@/components/Collapsible';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Mock data for routes - replace with real data from Supabase later
const mockRoutes = [
  {
    id: '1',
    name: 'Downtown Delivery Route',
    stops: 8,
    estimatedTime: '1h 45m',
    distance: '12.5 km',
    status: 'pending'
  },
  {
    id: '2',
    name: 'Westside Delivery',
    stops: 5,
    estimatedTime: '55m',
    distance: '8.2 km',
    status: 'in_progress'
  },
  {
    id: '3',
    name: 'Uptown Express',
    stops: 10,
    estimatedTime: '2h 10m',
    distance: '18.7 km',
    status: 'completed'
  },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme() ?? 'light';

  const filteredRoutes = mockRoutes.filter(route => 
    route.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'in_progress':
        return '#008000';
      case 'completed':
        return '#0000FF';
      default:
        return '#808080';
    }
  };

  const renderRouteItem = ({ item }: { item: typeof mockRoutes[0] }) => (
    <TouchableOpacity 
      style={styles.routeItem}
      onPress={() => console.log(`Route ${item.id} pressed`)}
    >
      <View style={styles.routeHeader}>
        <ThemedText type="defaultSemiBold" style={styles.routeName}>{item.name}</ThemedText>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
      </View>
      
      <View style={styles.routeDetails}>
        <View style={styles.routeDetailItem}>
          <IconSymbol name="chevron.right" size={16} weight="medium" color={Colors[colorScheme].icon} />
          <ThemedText>{item.stops} stops</ThemedText>
        </View>
        
        <View style={styles.routeDetailItem}>
          <IconSymbol name="chevron.right" size={16} weight="medium" color={Colors[colorScheme].icon} />
          <ThemedText>{item.estimatedTime}</ThemedText>
        </View>
        
        <View style={styles.routeDetailItem}>
          <IconSymbol name="chevron.right" size={16} weight="medium" color={Colors[colorScheme].icon} />
          <ThemedText>{item.distance}</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Routes</ThemedText>
      </ThemedView>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search routes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>
      
      <Collapsible title="Active Routes">
        <FlatList
          data={filteredRoutes.filter(r => r.status !== 'completed')}
          renderItem={renderRouteItem}
          keyExtractor={(item) => item.id}
          style={styles.routesList}
          ListEmptyComponent={
            <ThemedText style={styles.emptyText}>No active routes found</ThemedText>
          }
        />
      </Collapsible>
      
      <Collapsible title="Completed Routes">
        <FlatList
          data={filteredRoutes.filter(r => r.status === 'completed')}
          renderItem={renderRouteItem}
          keyExtractor={(item) => item.id}
          style={styles.routesList}
          ListEmptyComponent={
            <ThemedText style={styles.emptyText}>No completed routes found</ThemedText>
          }
        />
      </Collapsible>
      
      <TouchableOpacity style={styles.createButton}>
        <ThemedText style={styles.createButtonText}>Create New Route</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  routesList: {
    marginTop: 10,
  },
  routeItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeName: {
    fontSize: 18,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  routeDetails: {
    gap: 8,
  },
  routeDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: '#0a7ea4',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});