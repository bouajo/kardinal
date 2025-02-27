// app/(tabs)/routes.tsx
import React from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  FlatList
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Plus } from 'react-native-feather';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card, CardContent } from '@/components/ui/card';

// Mock data for routes
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
    name: 'Northside Delivery',
    stops: 12,
    estimatedTime: '2h 15m',
    distance: '18.3 km',
    status: 'completed'
  },
  {
    id: '4',
    name: 'Evening Express',
    stops: 6,
    estimatedTime: '1h 10m',
    distance: '9.7 km',
    status: 'pending'
  },
];

export default function RoutesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft stroke="#0f172a" width={24} height={24} />
        </TouchableOpacity>
        <ThemedText type="title">Routes</ThemedText>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <TouchableOpacity style={[styles.filterChip, styles.activeFilterChip]}>
            <ThemedText style={styles.activeFilterText}>All</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <ThemedText>In Progress</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <ThemedText>Pending</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <ThemedText>Completed</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <FlatList
        data={mockRoutes}
        contentContainerStyle={styles.routesList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.routeCard}>
            <CardContent style={styles.routeCardContent}>
              <ThemedText style={styles.routeName}>{item.name}</ThemedText>
              <ThemedView style={styles.routeDetails}>
                <ThemedText style={styles.routeDetailsText}>
                  {item.stops} stops • {item.estimatedTime} • {item.distance}
                </ThemedText>
                <ThemedView 
                  style={[
                    styles.statusBadge,
                    { 
                      backgroundColor: 
                        item.status === 'in_progress' ? '#0284c7' : 
                        item.status === 'pending' ? '#d97706' : '#16a34a'
                    }
                  ]}
                >
                  <ThemedText style={styles.statusText}>
                    {item.status === 'in_progress' ? 'In Progress' :
                      item.status === 'pending' ? 'Pending' : 'Completed'}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.viewButton]}
                  onPress={() => router.push('/(tabs)/route-optimization')}
                >
                  <ThemedText style={styles.actionButtonText}>View Route</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.startButton]}
                  onPress={() => router.push('/(tabs)/navigation')}
                >
                  <ThemedText style={styles.actionButtonText}>Start Navigation</ThemedText>
                </TouchableOpacity>
              </View>
            </CardContent>
          </Card>
        )}
      />
      
      <TouchableOpacity 
        style={styles.createRouteButton}
        onPress={() => router.push('/(tabs)/route-creation')}
      >
        <Plus stroke="#ffffff" width={24} height={24} />
        <ThemedText style={styles.createRouteText}>Create New Route</ThemedText>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  filterContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: '#3b82f6',
  },
  activeFilterText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  routesList: {
    padding: 16,
    paddingBottom: 80,
  },
  routeCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  routeCardContent: {
    padding: 16,
  },
  routeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  routeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeDetailsText: {
    fontSize: 14,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  viewButton: {
    backgroundColor: '#f1f5f9',
  },
  startButton: {
    backgroundColor: '#3b82f6',
  },
  actionButtonText: {
    fontWeight: '600',
    color: '#0f172a',
  },
  createRouteButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  createRouteText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});