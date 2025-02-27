// lib/supabase.js
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a custom storage implementation
const createCustomStorage = () => {
  // In-memory fallback
  const storage = {};
  
  return {
    getItem: async (key) => {
      try {
        return await AsyncStorage.getItem(key);
      } catch (error) {
        console.log('Error accessing AsyncStorage, using in-memory fallback');
        return storage[key] || null;
      }
    },
    setItem: async (key, value) => {
      try {
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        console.log('Error accessing AsyncStorage, using in-memory fallback');
        storage[key] = value;
      }
    },
    removeItem: async (key) => {
      try {
        await AsyncStorage.removeItem(key);
      } catch (error) {
        console.log('Error accessing AsyncStorage, using in-memory fallback');
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