import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and anon key
const supabaseUrl = 'https://eorqrhayppkxxnrrebvg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvcnFyaGF5cHBreHhucnJlYnZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTc1MzEsImV4cCI6MjA1NjA5MzUzMX0.8Oq2Ou_foxy07lcGl_r-t86Em0SOk0AuIB6cVikjd60';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });