import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Dimensions, 
  Alert 
} from 'react-native';
import { router } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Check, SkipForward, Info, AlertTriangle } from 'react-native-feather';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const { width, height } = Dimensions.get('window');

// Mock stops data
const mockStops = [
  {
    id: '1',
    address: '123 Main St, Anytown, US',
    latitude: 37.78825,
    longitude: -122.4324,
    priority: 'High'
  },
  {
    id: '2',
    address: '456 Oak Ave, Somewhere, US',
    latitude: 37.78845,
    longitude: -122.4344,
    priority: 'Normal'
  },
  {
    id: '3',
    address: '789 Pine Rd, Nowhere, US',
    latitude: 37.78865,
    longitude: -122.4364,
    priority: 'Low'
  }
];

export default function NavigationScreen() {
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [eta, setEta] = useState('12 mins');
  const [stops] = useState(mockStops);
  const mapRef = useRef(null);
  
  // Mock function to get polyline between current stop and next
  const getPolyline = () => {
    if (currentStopIndex < stops.length - 1) {
      return [
        {
          latitude: stops[currentStopIndex].latitude,
          longitude: stops[currentStopIndex].longitude
        },
        {
          latitude: stops[currentStopIndex + 1].latitude,
          longitude: stops[currentStopIndex + 1].longitude
        }
      ];
    }
    return [];
  };
  
  const handleCompleteStop = () => {
    if (currentStopIndex < stops.length - 1) {
      setCurrentStopIndex(currentStopIndex + 1);
    } else {
      // All stops completed
      Alert.alert('Route Completed', 'All stops have been completed!', [
        { text: 'OK', onPress: () => router.push('/(tabs)/route-summary') }
      ]);
    }
  };
  
  const handleSkipStop = () => {
    Alert.alert(
      'Skip Stop',
      'Are you sure you want to skip this stop?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Skip', onPress: () => {
          if (currentStopIndex < stops.length - 1) {
            setCurrentStopIndex(currentStopIndex + 1);
          }
        }}
      ]
    );
  };
  
  const handleStopDetails = () => {
    Alert.alert('Stop Details', stops[currentStopIndex].address);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: stops[0].latitude,
          longitude: stops[0].longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {stops.map((stop, index) => (
          <Marker
            key={stop.id}
            coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
            title={`Stop ${index + 1}`}
            description={stop.address}
            pinColor={index === currentStopIndex ? '#3b82f6' : index < currentStopIndex ? '#10b981' : '#ef4444'}
          />
        ))}
        <Polyline coordinates={getPolyline()} strokeColor="#3b82f6" strokeWidth={3} />
      </MapView>
      
      <View style={styles.overlay}>
        <View style={styles.progressContainer}>
          <ThemedText style={styles.progressText}>
            Stop {currentStopIndex + 1} of {stops.length}
          </ThemedText>
          <ThemedText style={styles.etaText}>ETA: {eta}</ThemedText>
        </View>
        
        <ThemedView style={styles.addressContainer}>
          <ThemedText style={styles.addressText} numberOfLines={2}>
            {stops[currentStopIndex].address}
          </ThemedText>
        </ThemedView>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCompleteStop}>
            <Check stroke="#ffffff" width={24} height={24} />
            <Text style={styles.buttonText}>Complete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleSkipStop}>
            <SkipForward stroke="#ffffff" width={24} height={24} />
            <Text style={styles.buttonText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleStopDetails}>
            <Info stroke="#ffffff" width={24} height={24} />
            <Text style={styles.buttonText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {stops[currentStopIndex].priority === 'High' && (
        <View style={styles.priorityAlert}>
          <AlertTriangle stroke="#ffffff" width={24} height={24} />
          <Text style={styles.priorityAlertText}>High Priority Stop</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  map: {
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  etaText: {
    fontSize: 16,
    color: '#64748b',
  },
  addressContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  addressText: {
    fontSize: 18,
    color: '#0f172a',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  priorityAlert: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  priorityAlertText: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});