// app/(tabs)/map.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
// Import MapView explicitly from react-native-maps
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

// Define proper types for our data
interface Stop {
  id: string;
  route_id: string;
  address: string;
  location: string;
  status: string;
  // Add other properties as needed
}

interface Route {
  id: string;
  // Add other properties as needed
}

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeRoute, setActiveRoute] = useState<Route | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Update driver location in Supabase
      if (user) {
        updateDriverLocation(location.coords.latitude, location.coords.longitude);
      }

      // Fetch active route
      fetchActiveRoute();
    })();
  }, [user]);

  const updateDriverLocation = async (latitude: number, longitude: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('driver_profiles')
        .update({
          current_location: `POINT(${longitude} ${latitude})`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const fetchActiveRoute = async () => {
    if (!user) return;

    try {
      // Get current active route
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('driver_id', user.id)
        .eq('status', 'in_progress')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setActiveRoute(data as Route);
        // Fetch stops for the active route
        fetchStops(data.id);
      }
    } catch (error) {
      console.error('Error fetching active route:', error);
    }
  };

  const fetchStops = async (routeId: string) => {
    try {
      const { data, error } = await supabase
        .from('stops')
        .select('*')
        .eq('route_id', routeId)
        .order('sequence_number', { ascending: true });

      if (error) throw error;
      setStops(data || []);
    } catch (error) {
      console.error('Error fetching stops:', error);
    }
  };

  if (!location) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>{errorMsg || 'Waiting for location...'}</ThemedText>
      </ThemedView>
    );
  }

  // Create an initial region based on the user's location
  const initialRegion: Region = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Function to parse point strings from the database
  const parsePointString = (pointStr: string | null | undefined) => {
    if (!pointStr) return null;
    const match = pointStr.toString().match(/POINT\((.+) (.+)\)/);
    if (!match) return null;
    
    return {
      latitude: parseFloat(match[2]),
      longitude: parseFloat(match[1])
    };
  };

  return (
    <ThemedView style={styles.container}>
      {/* @ts-ignore */}
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
      >
        {/* @ts-ignore */}
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Your Location"
          description="You are here"
        />
  
        {/* Route stops */}
        {stops.map((stop, index) => {
          const point = parsePointString(stop.location);
          if (!point) return null;
          
          return (
            /* @ts-ignore */
            <Marker
              key={stop.id}
              coordinate={point}
              title={`Stop ${index + 1}`}
              description={stop.address}
              pinColor={stop.status === 'completed' ? 'green' : 'red'}
            />
          );
        })}
  
        {/* Route line connecting stops */}
        {stops.length > 1 && (
          /* @ts-ignore */
          <Polyline
            coordinates={
              stops
                .map(stop => parsePointString(stop.location))
                .filter(Boolean) as {latitude: number, longitude: number}[]
            }
            strokeColor="#0a7ea4"
            strokeWidth={4}
          />
        )}
      </MapView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});