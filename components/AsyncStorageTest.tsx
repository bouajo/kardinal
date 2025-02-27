import React, { useEffect, useState } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from './ThemedText';

export const AsyncStorageTest = () => {
  const [storageStatus, setStorageStatus] = useState<string>('Testing AsyncStorage...');
  const [asyncStorageAvailable, setAsyncStorageAvailable] = useState<boolean | null>(null);
  const [asyncStorageVersion, setAsyncStorageVersion] = useState<string | null>(null);

  useEffect(() => {
    checkAsyncStorageAvailability();
  }, []);

  const checkAsyncStorageAvailability = () => {
    // Check if AsyncStorage is defined
    if (AsyncStorage === null || AsyncStorage === undefined) {
      setAsyncStorageAvailable(false);
      setStorageStatus('AsyncStorage is NULL or undefined! Module is not properly initialized.');
      return;
    }

    // Check methods
    const methods = ['getItem', 'setItem', 'removeItem', 'clear', 'getAllKeys'];
    const missingMethods = methods.filter(method => !(method in AsyncStorage));
    
    if (missingMethods.length > 0) {
      setAsyncStorageAvailable(false);
      setStorageStatus(`AsyncStorage is missing methods: ${missingMethods.join(', ')}`);
      return;
    }

    // Try to determine version from package.json, but this is a runtime check
    try {
      // This is just a basic check - the actual version would come from package.json
      setAsyncStorageVersion(AsyncStorage.toString().includes('native') 
        ? 'Native implementation' 
        : 'JS implementation');
    } catch (e) {
      setAsyncStorageVersion('Unknown');
    }

    setAsyncStorageAvailable(true);
    setStorageStatus('AsyncStorage appears to be available. Running tests...');
    testAsyncStorage();
  };

  const testAsyncStorage = async () => {
    if (!asyncStorageAvailable) {
      setStorageStatus('Cannot test AsyncStorage because it is not available');
      return;
    }

    try {
      setStorageStatus('Testing AsyncStorage operations...');
      
      // Test saving data
      const testValue = `test-value-${Date.now()}`;
      await AsyncStorage.setItem('test_key', testValue);
      console.log('AsyncStorage test: Data saved successfully');
      
      // Test retrieving data
      const retrievedValue = await AsyncStorage.getItem('test_key');
      console.log('AsyncStorage test: Retrieved value:', retrievedValue);
      
      if (retrievedValue === testValue) {
        setStorageStatus('✅ AsyncStorage is working properly! Save and retrieve successful.');
      } else if (retrievedValue) {
        setStorageStatus(`⚠️ AsyncStorage partially working. Expected "${testValue}" but got "${retrievedValue}"`);
      } else {
        setStorageStatus('⚠️ Data was saved but could not be retrieved');
      }
    } catch (error: any) {
      console.error('AsyncStorage test failed:', error);
      setStorageStatus(`❌ AsyncStorage error: ${error?.message || 'Unknown error'}`);
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
    <View style={styles.container}>
      <ThemedText style={styles.title}>
        AsyncStorage Diagnostics
      </ThemedText>
      
      <View style={styles.statusContainer}>
        <ThemedText style={styles.label}>Module Status:</ThemedText>
        <ThemedText style={[
          styles.status,
          asyncStorageAvailable === true ? styles.statusSuccess : 
          asyncStorageAvailable === false ? styles.statusError : styles.statusPending
        ]}>
          {asyncStorageAvailable === true ? 'Available' : 
           asyncStorageAvailable === false ? 'Not Available' : 'Checking...'}
        </ThemedText>
      </View>
      
      {asyncStorageVersion && (
        <View style={styles.statusContainer}>
          <ThemedText style={styles.label}>Implementation:</ThemedText>
          <ThemedText>{asyncStorageVersion}</ThemedText>
        </View>
      )}
      
      <ThemedText style={styles.resultText}>
        {storageStatus}
      </ThemedText>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Test AsyncStorage"
          onPress={testAsyncStorage}
          disabled={!asyncStorageAvailable}
        />
        <View style={styles.buttonSpacer} />
        <Button
          title="Reset Test"
          onPress={resetTest}
          disabled={!asyncStorageAvailable}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  label: {
    fontWeight: '600',
  },
  status: {
    fontWeight: 'bold',
  },
  statusSuccess: {
    color: '#10b981',
  },
  statusError: {
    color: '#ef4444',
  },
  statusPending: {
    color: '#f59e0b',
  },
  resultText: {
    marginVertical: 16,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  buttonSpacer: {
    width: 16,
  },
}); 