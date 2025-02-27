import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { router } from 'expo-router';
import { MapPin, Plus, Package, Clock } from 'react-native-feather';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/button';

// Define the Stop interface
interface Stop {
  id: string;
  address: string;
  priority: 'Low' | 'Normal' | 'High';
  notes?: string;
}

// Mock function for getting stops
const getStops = (): Stop[] => {
  return [
    { id: '1', address: '123 Main St, City, State', priority: 'Normal' },
    { id: '2', address: '456 Market St, City, State', priority: 'High' },
  ];
};

export default function RouteCreationScreen() {
  const [routeTitle, setRouteTitle] = useState('');
  const [stops, setStops] = useState<Stop[]>(getStops());
  const scrollViewRef = useRef<ScrollView>(null);
  
  const addStop = () => {
    const newStop: Stop = {
      id: Date.now().toString(),
      address: '',
      priority: 'Normal'
    };
    setStops([...stops, newStop]);
  };
  
  const updateStop = (id: string, field: keyof Stop, value: string) => {
    setStops(stops.map(stop => 
      stop.id === id ? { ...stop, [field]: value } : stop
    ));
  };
  
  const removeStop = (id: string) => {
    setStops(stops.filter(stop => stop.id !== id));
  };
  
  const handleOptimizeRoute = () => {
    if (routeTitle.trim() === '') {
      Alert.alert('Error', 'Please enter a route title.');
      return;
    }
    
    if (stops.length < 2) {
      Alert.alert('Error', 'Please add at least two stops to optimize the route.');
      return;
    }
    
    router.push('/(tabs)/route-optimization');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ThemedText>Back</ThemedText>
          </TouchableOpacity>
          <ThemedText type="title">Create New Route</ThemedText>
          <View style={{width: 24}} />
        </View>
        
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.routeTitleInput}
            placeholder="Enter Route Title"
            value={routeTitle}
            onChangeText={setRouteTitle}
          />
          
          {stops.map((stop, index) => (
            <ThemedView key={stop.id} style={styles.stopItem}>
              <View style={styles.stopHeader}>
                <View style={styles.stopNumberBadge}>
                  <ThemedText style={styles.stopNumberText}>{index + 1}</ThemedText>
                </View>
                <TextInput
                  style={styles.addressInput}
                  placeholder="Enter address"
                  value={stop.address}
                  onChangeText={(text) => updateStop(stop.id, 'address', text)}
                />
                <TouchableOpacity onPress={() => removeStop(stop.id)}>
                  <ThemedText style={styles.removeText}>Remove</ThemedText>
                </TouchableOpacity>
              </View>
              
              <View style={styles.stopDetails}>
                <View style={styles.prioritySelector}>
                  <ThemedText>Priority:</ThemedText>
                  <TouchableOpacity
                    onPress={() => {
                      const priorities = ['Low', 'Normal', 'High'];
                      const currentIndex = priorities.indexOf(stop.priority);
                      const nextPriority = priorities[(currentIndex + 1) % priorities.length];
                      updateStop(stop.id, 'priority', nextPriority);
                    }}
                  >
                    <ThemedText style={{
                      color: stop.priority === 'High' ? '#ef4444' : 
                             stop.priority === 'Normal' ? '#f59e0b' : '#10b981'
                    }}>
                      {stop.priority}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </ThemedView>
          ))}
          
          <TouchableOpacity style={styles.addStopButton} onPress={addStop}>
            <Plus stroke="#ffffff" width={24} height={24} />
            <Text style={styles.addStopText}>Add Another Stop</Text>
          </TouchableOpacity>
        </ScrollView>
        
        <TouchableOpacity style={styles.optimizeButton} onPress={handleOptimizeRoute}>
          <MapPin stroke="#ffffff" width={24} height={24} />
          <Text style={styles.optimizeButtonText}>Optimize Route</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardAvoidingView: {
    flex: 1,
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
  scrollContent: {
    padding: 16,
  },
  routeTitleInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
    paddingVertical: 8,
    marginBottom: 24,
  },
  stopItem: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  stopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stopNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  stopNumberText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  addressInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  removeText: {
    color: '#ef4444',
    marginLeft: 8,
  },
  stopDetails: {
    marginTop: 8,
  },
  prioritySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addStopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  addStopText: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  optimizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  optimizeButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
  },
});