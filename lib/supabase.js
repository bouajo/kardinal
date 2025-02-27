// lib/supabase.js
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Create a custom storage implementation
const createCustomStorage = () => {
  // In-memory fallback
  const storage = {};
  
  // Try to load AsyncStorage dynamically to avoid the "missing native modules" error
  let AsyncStorage;
  try {
    AsyncStorage = require('@react-native-async-storage/async-storage').default;
  } catch (error) {
    console.warn('AsyncStorage not available, using in-memory storage fallback');
  }
  
  return {
    getItem: async (key) => {
      try {
        if (AsyncStorage) {
          return await AsyncStorage.getItem(key);
        }
        return storage[key] || null;
      } catch (error) {
        console.warn('Error accessing storage, using in-memory fallback');
        return storage[key] || null;
      }
    },
    setItem: async (key, value) => {
      try {
        if (AsyncStorage) {
          await AsyncStorage.setItem(key, value);
        }
        storage[key] = value;
      } catch (error) {
        console.warn('Error accessing storage, using in-memory fallback');
        storage[key] = value;
      }
    },
    removeItem: async (key) => {
      try {
        if (AsyncStorage) {
          await AsyncStorage.removeItem(key);
        }
        delete storage[key];
      } catch (error) {
        console.warn('Error accessing storage, using in-memory fallback');
        delete storage[key];
      }
    }
  };
};

// Replace with your Supabase URL and anon key
const supabaseUrl = 'https://eorqrhayppkxxnrrebvg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvcnFyaGF5cHBreHhucnJlYnZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTc1MzEsImV4cCI6MjA1NjA5MzUzMX0.8Oq2Ou_foxy07lcGl_r-t86Em0SOk0AuIB6cVikjd60';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createCustomStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});