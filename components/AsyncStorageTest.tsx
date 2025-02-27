import React, { useEffect, useState } from 'react';
import { View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from './ThemedText';

export const AsyncStorageTest = () => {
  const [storageStatus, setStorageStatus] = useState<string>('Testing AsyncStorage...');

  useEffect(() => {
    testAsyncStorage();
  }, []);

  const testAsyncStorage = async () => {
    try {
      // Test saving data
      await AsyncStorage.setItem('test_key', 'AsyncStorage is working!');
      console.log('Storage test: Data saved successfully');
      
      // Test retrieving data
      const value = await AsyncStorage.getItem('test_key');
      console.log('Storage test: Retrieved value:', value);
      
      if (value) {
        setStorageStatus('AsyncStorage is working properly!');
      } else {
        setStorageStatus('Data was saved but could not be retrieved');
      }
    } catch (error: any) {
      console.error('Storage test failed:', error);
      setStorageStatus(`AsyncStorage error: ${error?.message || 'Unknown error'}`);
    }
  };

  const resetTest = async () => {
    try {
      await AsyncStorage.removeItem('test_key');
      setStorageStatus('Test reset. Press button to test again.');
    } catch (error: any) {
      setStorageStatus(`Reset error: ${error?.message || 'Unknown error'}`);
    }
  };

  return (
    <View style={{ padding: 20, backgroundColor: '#f0f0f0', borderRadius: 8, margin: 10 }}>
      <ThemedText style={{ fontWeight: 'bold', marginBottom: 10 }}>
        AsyncStorage Test
      </ThemedText>
      <ThemedText style={{ marginBottom: 15 }}>
        {storageStatus}
      </ThemedText>
      <Button
        title="Test AsyncStorage Again"
        onPress={testAsyncStorage}
      />
      <View style={{ marginTop: 10 }}>
        <Button
          title="Reset Test"
          onPress={resetTest}
        />
      </View>
    </View>
  );
}; 