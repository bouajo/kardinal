import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Switch, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  SafeAreaView,
  Modal,
  Image
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    useMiles: false,
    saveRouteHistory: true,
    dataSync: true,
    showTraffic: true,
  });
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const toggleSetting = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear App Data",
      "Are you sure you want to clear all app data? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Clear Data", 
          onPress: () => {
            // In a real app, this would clear stored data
            Alert.alert("Success", "All app data has been cleared.");
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleSubscription = () => {
    // In a real app, this would handle payment processing
    Alert.alert(
      "Subscription Updated",
      isSubscribed 
        ? "Your subscription has been canceled."
        : "You have successfully subscribed to the Premium plan.",
      [{ text: "OK", onPress: () => setIsSubscribed(!isSubscribed) }]
    );
    setShowSubscriptionModal(false);
  };

  const renderSectionHeader = (title) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const renderSwitchItem = (icon, label, value, key) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <View style={styles.iconContainer}>
          <FontAwesome name={icon} size={18} color="#2196F3" />
        </View>
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Switch
        trackColor={{ false: "#ddd", true: "#2196F3" }}
        thumbColor={value ? "#fff" : "#fff"}
        ios_backgroundColor="#ddd"
        onValueChange={() => toggleSetting(key)}
        value={value}
      />
    </View>
  );

  const renderButtonItem = (icon, label, onPress, destructive = false) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingInfo}>
        <View style={styles.iconContainer}>
          <FontAwesome name={icon} size={18} color={destructive ? "#FF3B30" : "#2196F3"} />
        </View>
        <Text style={[styles.settingLabel, destructive && { color: "#FF3B30" }]}>{label}</Text>
      </View>
      <FontAwesome name="chevron-right" size={14} color="#ccc" />
    </TouchableOpacity>
  );

  const renderSubscriptionModal = () => (
    <Modal
      visible={showSubscriptionModal}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Premium Subscription</Text>
            <TouchableOpacity onPress={() => setShowSubscriptionModal(false)}>
              <FontAwesome name="times" size={20} color="#333" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.premiumContainer}>
            <View style={styles.premiumHeader}>
              <FontAwesome name="star" size={30} color="#FFD700" />
              <Text style={styles.premiumTitle}>Premium Plan</Text>
              <Text style={styles.premiumPrice}>4.99€<Text style={styles.periodText}>/month</Text></Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <FontAwesome name="check" size={16} color="#2196F3" style={styles.featureIcon} />
                <Text style={styles.featureText}>Unlimited route optimizations</Text>
              </View>
              <View style={styles.featureItem}>
                <FontAwesome name="check" size={16} color="#2196F3" style={styles.featureIcon} />
                <Text style={styles.featureText}>Advanced traffic routing</Text>
              </View>
              <View style={styles.featureItem}>
                <FontAwesome name="check" size={16} color="#2196F3" style={styles.featureIcon} />
                <Text style={styles.featureText}>Save unlimited routes</Text>
              </View>
              <View style={styles.featureItem}>
                <FontAwesome name="check" size={16} color="#2196F3" style={styles.featureIcon} />
                <Text style={styles.featureText}>Priority support</Text>
              </View>
              <View style={styles.featureItem}>
                <FontAwesome name="check" size={16} color="#2196F3" style={styles.featureIcon} />
                <Text style={styles.featureText}>No advertisements</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.subscribeButton, isSubscribed && styles.cancelButton]}
              onPress={handleSubscription}
            >
              <Text style={styles.subscribeButtonText}>
                {isSubscribed ? 'Cancel Subscription' : 'Subscribe Now'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Premium Banner */}
        <TouchableOpacity 
          style={styles.premiumBanner}
          onPress={() => setShowSubscriptionModal(true)}
        >
          <View style={styles.premiumBannerContent}>
            <View style={styles.premiumBadge}>
              <FontAwesome name="star" size={16} color="#FFF" />
            </View>
            <View style={styles.premiumBannerText}>
              <Text style={styles.premiumBannerTitle}>
                {isSubscribed ? 'You are a Premium member!' : 'Upgrade to Premium'}
              </Text>
              <Text style={styles.premiumBannerSubtitle}>
                {isSubscribed ? 'Enjoy all premium features' : 'Get unlimited route optimizations'}
              </Text>
            </View>
          </View>
          <FontAwesome name="chevron-right" size={16} color="#FFF" />
        </TouchableOpacity>

        {renderSectionHeader("App Preferences")}
        {renderSwitchItem("bell", "Notifications", settings.notifications, "notifications")}
        {renderSwitchItem("moon-o", "Dark Mode", settings.darkMode, "darkMode")}
        {renderSwitchItem("road", "Use Miles Instead of Kilometers", settings.useMiles, "useMiles")}
        
        {renderSectionHeader("Map Settings")}
        {renderSwitchItem("map", "Show Traffic", settings.showTraffic, "showTraffic")}
        {renderButtonItem("map-marker", "Default Start Location", () => {})}
        
        {renderSectionHeader("Data & Privacy")}
        {renderSwitchItem("history", "Save Route History", settings.saveRouteHistory, "saveRouteHistory")}
        {renderSwitchItem("cloud", "Sync Data Across Devices", settings.dataSync, "dataSync")}
        {renderButtonItem("lock", "Privacy Settings", () => {})}
        
        {renderSectionHeader("Account")}
        {renderButtonItem("user", "Account Information", () => {})}
        {renderButtonItem("sign-out", "Sign Out", () => {})}
        
        {renderSectionHeader("Help & Support")}
        {renderButtonItem("question-circle", "Help Center", () => {})}
        {renderButtonItem("envelope", "Contact Support", () => {})}
        {renderButtonItem("info-circle", "About", () => {})}
        
        {renderSectionHeader("Danger Zone")}
        {renderButtonItem("trash", "Clear App Data", handleClearData, true)}
      </ScrollView>
      
      {renderSubscriptionModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  premiumContainer: {
    padding: 20,
  },
  premiumHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  premiumTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  premiumPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    marginTop: 5,
  },
  periodText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 15,
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
  },
  subscribeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2196F3',
    padding: 16,
    marginTop: 1,
  },
  premiumBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  premiumBannerText: {
    flex: 1,
  },
  premiumBannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  premiumBannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  }
});

export default SettingsScreen; 