// lib/supabase.js
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Log AsyncStorage version and details for debugging
console.log('AsyncStorage loaded:', AsyncStorage ? 'Yes' : 'No');
if (AsyncStorage) {
  console.log('AsyncStorage methods available:', 
    Object.keys(AsyncStorage).filter(key => typeof AsyncStorage[key] === 'function').join(', '));
}

// Create a custom storage implementation with better error handling
const createCustomStorage = () => {
  // In-memory fallback
  const inMemoryStorage = {};
  
  // Check if AsyncStorage is available
  const isAsyncStorageAvailable = AsyncStorage !== null && AsyncStorage !== undefined;
  console.log('AsyncStorage availability check:', isAsyncStorageAvailable ? 'Available' : 'NOT AVAILABLE - Using in-memory fallback');
  
  return {
    getItem: async (key) => {
      if (!isAsyncStorageAvailable) {
        console.log(`AsyncStorage unavailable, using in-memory for GET: ${key}`);
        return inMemoryStorage[key] || null;
      }
      
      try {
        const value = await AsyncStorage.getItem(key);
        return value;
      } catch (error) {
        console.log(`Error reading from AsyncStorage: ${error.message}`);
        console.log('Stack trace:', error.stack);
        return inMemoryStorage[key] || null;
      }
    },
    setItem: async (key, value) => {
      if (!isAsyncStorageAvailable) {
        console.log(`AsyncStorage unavailable, using in-memory for SET: ${key}`);
        inMemoryStorage[key] = value;
        return;
      }
      
      try {
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        console.log(`Error writing to AsyncStorage: ${error.message}`);
        console.log('Stack trace:', error.stack);
        inMemoryStorage[key] = value;
      }
    },
    removeItem: async (key) => {
      if (!isAsyncStorageAvailable) {
        console.log(`AsyncStorage unavailable, using in-memory for REMOVE: ${key}`);
        delete inMemoryStorage[key];
        return;
      }
      
      try {
        await AsyncStorage.removeItem(key);
      } catch (error) {
        console.log(`Error removing from AsyncStorage: ${error.message}`);
        console.log('Stack trace:', error.stack);
        delete inMemoryStorage[key];
      }
    }
  };
};

// Replace with your Supabase URL and anon key
const supabaseUrl = 'https://eorqrhayppkxxnrrebvg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvcnFyaGF5cHBreHhucnJlYnZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTc1MzEsImV4cCI6MjA1NjA5MzUzMX0.8Oq2Ou_foxy07lcGl_r-t86Em0SOk0AuIB6cVikjd60';

// Wait a moment to ensure proper initialization
setTimeout(() => {
  console.log('Creating Supabase client with custom storage...');  
}, 100);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createCustomStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});