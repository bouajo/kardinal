import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Dimensions, 
  Alert,
  FlatList
} from 'react-native';
import { router } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { ArrowLeft, Navigation, Edit2, Check } from 'react-native-feather';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const { width, height } = Dimensions.get('window');

// Define the Stop interface
interface Stop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  priority: 'Low' | 'Normal' | 'High';
}

// Define the RoutePoint interface
interface RoutePoint {
  latitude: number;
  longitude: number;
}

// Mock data for route stops
const mockStops: Stop[] = [
  {
    id: '1',
    name: 'Customer A',
    address: '123 Main St, San Francisco, CA',
    latitude: 37.7749,
    longitude: -122.4194,
    priority: 'High'
  },
  {
    id: '2',
    name: 'Customer B',
    address: '456 Market St, San Francisco, CA',
    latitude: 37.7912,
    longitude: -122.4007,
    priority: 'Normal'
  },
  {
    id: '3',
    name: 'Customer C',
    address: '789 Valencia St, San Francisco, CA',
    latitude: 37.7598,
    longitude: -122.4364,
    priority: 'Low'
  }
];

// Mock function to get route polyline
const getRoutePolyline = (stops: Stop[]): RoutePoint[] => {
  return stops.map(stop => ({
    latitude: stop.latitude,
    longitude: stop.longitude
  }));
};

export default function RouteOptimizationScreen() {
  const [selectedStops, setSelectedStops] = useState<Stop[]>([...mockStops]);
  const [routeCoordinates, setRouteCoordinates] = useState<RoutePoint[]>([]);
  const [optimizationPreference, setOptimizationPreference] = useState('fastest');

  useEffect(() => {
    setRouteCoordinates(getRoutePolyline(selectedStops));
  }, [selectedStops]);

  const renderStopItem = ({ item, index }: { item: Stop; index: number }) => (
    <TouchableOpacity style={styles.stopItem}>
      <View style={styles.stopItemContent}>
        <View style={styles.stopItemNumber}>
          <ThemedText style={styles.stopNumberText}>{index + 1}</ThemedText>
        </View>
        <View style={styles.stopItemDetails}>
          <ThemedText style={styles.stopAddress} numberOfLines={1}>{item.address}</ThemedText>
          <View style={[
            styles.priorityBadge,
            {
              backgroundColor: 
                item.priority === 'High' ? '#ef4444' : 
                item.priority === 'Normal' ? '#f59e0b' : '#10b981'
            }
          ]}>
            <ThemedText style={styles.priorityText}>{item.priority}</ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft stroke="#0f172a" width={24} height={24} />
        </TouchableOpacity>
        <ThemedText type="title">Route Optimization</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: selectedStops[0].latitude,
          longitude: selectedStops[0].longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {selectedStops.map((stop: Stop, index: number) => (
          <Marker
            key={stop.id}
            coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
            title={`Stop ${index + 1}`}
            description={stop.address}
          />
        ))}
        <Polyline coordinates={routeCoordinates} strokeColor="#3b82f6" strokeWidth={3} />
      </MapView>

      <View style={styles.optimizationSettings}>
        <ThemedText type="defaultSemiBold">Optimization Preference:</ThemedText>
        <View style={styles.settingsOptions}>
          {['fastest', 'shortest', 'balanced'].map((pref: string) => (
            <TouchableOpacity
              key={pref}
              style={[
                styles.preferenceOption,
                optimizationPreference === pref && styles.selectedPreference
              ]}
              onPress={() => setOptimizationPreference(pref)}
            >
              <ThemedText>{pref.charAt(0).toUpperCase() + pref.slice(1)}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ThemedView style={styles.stopsContainer}>
        <ThemedText type="subtitle">Stops ({selectedStops.length})</ThemedText>
        <FlatList
          data={selectedStops}
          keyExtractor={(item) => item.id}
          renderItem={renderStopItem}
          style={styles.stopList}
        />
      </ThemedView>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]} 
          onPress={() => router.push('/(tabs)/route-creation')}
        >
          <Edit2 stroke="#ffffff" width={20} height={20} />
          <Text style={styles.buttonText}>Edit Stops</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.startButton]} 
          onPress={() => router.push('/(tabs)/navigation')}
        >
          <Navigation stroke="#ffffff" width={20} height={20} />
          <Text style={styles.buttonText}>Start Route</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.confirmButton]} 
          onPress={() => {
            Alert.alert('Success', 'Route has been saved.');
            router.push("/");
          }}
        >
          <Check stroke="#ffffff" width={20} height={20} />
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
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
  map: {
    width: width,
    height: height * 0.3,
  },
  optimizationSettings: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  settingsOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  preferenceOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  selectedPreference: {
    backgroundColor: '#3b82f6',
  },
  stopsContainer: {
    flex: 1,
    marginTop: 10,
  },
  stopItem: {
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  stopItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  stopItemNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stopNumberText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  stopItemDetails: {
    flex: 1,
  },
  stopAddress: {
    fontSize: 16,
    marginBottom: 4,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  priorityText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: '#64748b',
  },
  startButton: {
    backgroundColor: '#3b82f6',
  },
  confirmButton: {
    backgroundColor: '#10b981',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 14,
  },
  stopList: {
    padding: 16,
  },
});