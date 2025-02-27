import React from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Switch 
} from 'react-native';
import { router } from 'expo-router';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  MapPin, 
  Shield, 
  HelpCircle, 
  LogOut 
} from 'react-native-feather';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card, CardContent } from '@/components/ui/card';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [locationTracking, setLocationTracking] = React.useState(true);
  
  const toggleDarkMode = () => setDarkMode(previousState => !previousState);
  const toggleNotifications = () => setNotifications(previousState => !previousState);
  const toggleLocationTracking = () => setLocationTracking(previousState => !previousState);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft stroke="#0f172a" width={24} height={24} />
        </TouchableOpacity>
        <ThemedText type="title">Settings</ThemedText>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <CardContent>
            <ThemedView style={styles.profileHeader}>
              <View style={styles.profileCircle}>
                <User stroke="#0f172a" width={32} height={32} />
              </View>
              <View style={styles.profileInfo}>
                <ThemedText style={styles.profileName}>John Doe</ThemedText>
                <ThemedText style={styles.profileEmail}>john.doe@example.com</ThemedText>
              </View>
            </ThemedView>
            <TouchableOpacity style={styles.editProfileButton}>
              <ThemedText style={styles.editProfileText}>Edit Profile</ThemedText>
            </TouchableOpacity>
          </CardContent>
        </Card>
        
        <ThemedText type="subtitle" style={styles.sectionTitle}>App Settings</ThemedText>
        
        <Card style={styles.card}>
          <CardContent>
            <View style={styles.settingItem}>
              <View style={styles.settingLabel}>
                <Bell stroke="#0f172a" width={22} height={22} style={styles.settingIcon} />
                <ThemedText>Push Notifications</ThemedText>
              </View>
              <Switch 
                value={notifications} 
                onValueChange={toggleNotifications}
                trackColor={{ false: '#e2e8f0', true: '#bfdbfe' }}
                thumbColor={notifications ? '#3b82f6' : '#f1f5f9'}
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingLabel}>
                <MapPin stroke="#0f172a" width={22} height={22} style={styles.settingIcon} />
                <ThemedText>Location Services</ThemedText>
              </View>
              <Switch 
                value={locationTracking} 
                onValueChange={toggleLocationTracking}
                trackColor={{ false: '#e2e8f0', true: '#bfdbfe' }}
                thumbColor={locationTracking ? '#3b82f6' : '#f1f5f9'}
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingLabel}>
                <View style={styles.settingIcon} />
                <ThemedText>Dark Mode</ThemedText>
              </View>
              <Switch 
                value={darkMode} 
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#e2e8f0', true: '#bfdbfe' }}
                thumbColor={darkMode ? '#3b82f6' : '#f1f5f9'}
              />
            </View>
          </CardContent>
        </Card>
        
        <ThemedText type="subtitle" style={styles.sectionTitle}>Other</ThemedText>
        
        <Card style={styles.card}>
          <CardContent>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLabel}>
                <Shield stroke="#0f172a" width={22} height={22} style={styles.settingIcon} />
                <ThemedText>Privacy & Security</ThemedText>
              </View>
              <ThemedText style={styles.menuArrow}>›</ThemedText>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLabel}>
                <HelpCircle stroke="#0f172a" width={22} height={22} style={styles.settingIcon} />
                <ThemedText>Help & Support</ThemedText>
              </View>
              <ThemedText style={styles.menuArrow}>›</ThemedText>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLabel}>
                <LogOut stroke="#ef4444" width={22} height={22} style={styles.settingIcon} />
                <ThemedText style={{ color: '#ef4444' }}>Log Out</ThemedText>
              </View>
              <ThemedText style={styles.menuArrow}>›</ThemedText>
            </TouchableOpacity>
          </CardContent>
        </Card>
        
        <ThemedText style={styles.versionText}>Version 1.0.0</ThemedText>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748b',
  },
  editProfileButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  editProfileText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
    width: 22,
    height: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  menuItemLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuArrow: {
    fontSize: 20,
    color: '#94a3b8',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#94a3b8',
    fontSize: 12,
  }
});