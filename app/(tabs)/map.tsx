// app/(tabs)/map.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function MapScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Map View</ThemedText>
      <ThemedText>Map functionality is currently unavailable.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});