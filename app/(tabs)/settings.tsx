// app/(tabs)/settings.tsx
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { AsyncStorageTest } from '@/components/AsyncStorageTest';
import { router } from 'expo-router';
import { ChevronRight } from 'react-native-feather';

function SettingsScreen() {
  const { signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>Settings</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.profileSection}>
        <ThemedView style={styles.avatarPlaceholder}>
          <ThemedText style={styles.avatarText}>JD</ThemedText>
        </ThemedView>
        <ThemedView style={styles.profileInfo}>
          <ThemedText style={styles.profileName}>John Doe</ThemedText>
          <ThemedText style={styles.profileEmail}>john.doe@example.com</ThemedText>
        </ThemedView>
      </ThemedView>
      
      <Card style={styles.settingsCard}>
        <CardContent>
          <ThemedView style={styles.settingItem}>
            <ThemedText style={styles.settingLabel}>Notifications</ThemedText>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#e2e8f0", true: "#0ea5e9" }}
            />
          </ThemedView>
          
          <ThemedView style={styles.settingItem}>
            <ThemedText style={styles.settingLabel}>Location Services</ThemedText>
            <Switch
              value={locationTracking}
              onValueChange={setLocationTracking}
              trackColor={{ false: "#e2e8f0", true: "#0ea5e9" }}
            />
          </ThemedView>
          
          <ThemedView style={styles.settingItem}>
            <ThemedText style={styles.settingLabel}>Dark Mode</ThemedText>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#e2e8f0", true: "#0ea5e9" }}
            />
          </ThemedView>
        </CardContent>
      </Card>
      
      <Card style={styles.settingsCard}>
        <CardContent>
          <TouchableOpacity style={styles.menuItem}>
            <ThemedText style={styles.menuLabel}>Privacy Policy</ThemedText>
            <ChevronRight stroke="#64748b" width={20} height={20} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <ThemedText style={styles.menuLabel}>Help & Support</ThemedText>
            <ChevronRight stroke="#64748b" width={20} height={20} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
            <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
            <ChevronRight stroke="#f44336" width={20} height={20} />
          </TouchableOpacity>
        </CardContent>
      </Card>
      
      {/* AsyncStorage Test Component */}
      <AsyncStorageTest />
      
      <ThemedView style={styles.versionContainer}>
        <ThemedText style={styles.versionText}>Kardinal v1.0.0</ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  profileEmail: {
    color: '#64748b',
    marginTop: 4,
  },
  settingsCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#0f172a',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  menuLabel: {
    fontSize: 16,
    color: '#0f172a',
  },
  signOutText: {
    fontSize: 16,
    color: '#f44336',
    fontWeight: '600',
  },
  versionContainer: {
    padding: 16,
    alignItems: 'center',
  },
  versionText: {
    color: '#94a3b8',
    fontSize: 14,
  },
});

export default SettingsScreen;