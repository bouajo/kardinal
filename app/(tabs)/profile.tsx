// app/(tabs)/profile.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

// Define proper interfaces for our data
interface Profile {
  id: string;
  full_name: string;
  vehicle_type: string | null;
  license_plate: string | null;
  // Add other properties as needed
}

interface Metrics {
  routes_completed: number;
  stops_completed: number;
  on_time_delivery_rate: number;
  efficiency_score: number;
  // Add other properties as needed
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPerformanceMetrics();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('driver_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      setProfile(data as Profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformanceMetrics = async () => {
    if (!user) return;
    
    try {
      // Get the most recent metrics
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('driver_id', user.id)
        .order('date', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setMetrics(data as Metrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Profile</ThemedText>
      
      <ThemedView style={styles.profileCard}>
        <ThemedText type="defaultSemiBold" style={styles.name}>
          {profile?.full_name || 'Driver'}
        </ThemedText>
        <ThemedText>{user?.email}</ThemedText>
        <ThemedText>Vehicle: {profile?.vehicle_type || 'Not specified'}</ThemedText>
        {profile?.license_plate && (
          <ThemedText>License Plate: {profile.license_plate}</ThemedText>
        )}
      </ThemedView>

      {metrics && (
        <ThemedView style={styles.metricsCard}>
          <ThemedText type="subtitle">Performance Metrics</ThemedText>
          <ThemedText>Routes Completed: {metrics.routes_completed}</ThemedText>
          <ThemedText>Stops Completed: {metrics.stops_completed}</ThemedText>
          <ThemedText>On-time Delivery Rate: {metrics.on_time_delivery_rate}%</ThemedText>
          <ThemedText>Efficiency Score: {metrics.efficiency_score}</ThemedText>
        </ThemedView>
      )}

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  name: {
    fontSize: 24,
    marginBottom: 8,
  },
  metricsCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  signOutButton: {
    marginTop: 40,
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutText: {
    color: 'white',
    fontWeight: 'bold',
  },
});