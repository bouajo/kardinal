// app/(tabs)/profile.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Profile</ThemedText>
      <ThemedText style={styles.message}>User profile information will be displayed here.</ThemedText>
      
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginVertical: 20,
    textAlign: 'center',
  },
  signOutButton: {
    marginTop: 40,
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  signOutText: {
    color: 'white',
    fontWeight: 'bold',
  },
});