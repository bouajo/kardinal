// app/(tabs)/index.tsx
import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Platform } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withRepeat,
  withDelay,
  Easing
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Mock data for routes
const mockRoutes = [
  {
    id: '1',
    name: 'Downtown Delivery Route',
    stops: 8,
    estimatedTime: '1h 45m',
    distance: '12.5 km',
    status: 'pending'
  },
  {
    id: '2',
    name: 'Westside Delivery',
    stops: 5,
    estimatedTime: '55m',
    distance: '8.2 km',
    status: 'in_progress'
  },
];

// Calculate stats
const calculateStats = () => {
  return {
    totalRoutes: 25,
    completedRoutes: 18,
    completionRate: 72,
    todayStops: 12
  };
};

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const heroScale = useSharedValue(0.95);
  const cardOpacity1 = useSharedValue(0);
  const cardOpacity2 = useSharedValue(0);
  const cardOpacity3 = useSharedValue(0);
  const cardTranslateY1 = useSharedValue(20);
  const cardTranslateY2 = useSharedValue(20);
  const cardTranslateY3 = useSharedValue(20);
  const [refreshing, setRefreshing] = React.useState(false);
  const stats = calculateStats();
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  
  useEffect(() => {
    // Animate hero section on load
    heroScale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
    
    // Staggered animations for cards
    cardOpacity1.value = withDelay(200, withTiming(1, { duration: 600 }));
    cardTranslateY1.value = withDelay(200, withTiming(0, { duration: 600 }));
    
    cardOpacity2.value = withDelay(400, withTiming(1, { duration: 600 }));
    cardTranslateY2.value = withDelay(400, withTiming(0, { duration: 600 }));
    
    cardOpacity3.value = withDelay(600, withTiming(1, { duration: 600 }));
    cardTranslateY3.value = withDelay(600, withTiming(0, { duration: 600 }));
  }, []);
  
  const heroAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: heroScale.value }],
    };
  });
  
  const card1Style = useAnimatedStyle(() => {
    return {
      opacity: cardOpacity1.value,
      transform: [{ translateY: cardTranslateY1.value }],
    };
  });
  
  const card2Style = useAnimatedStyle(() => {
    return {
      opacity: cardOpacity2.value,
      transform: [{ translateY: cardTranslateY2.value }],
    };
  });
  
  const card3Style = useAnimatedStyle(() => {
    return {
      opacity: cardOpacity3.value,
      transform: [{ translateY: cardTranslateY3.value }],
    };
  });

  const handleCardPress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Stats Overview */}
      <Animated.View style={[styles.statsOverview, heroAnimatedStyle]}>
        <ThemedView style={styles.statsGrid}>
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statValue}>{stats.todayStops}</ThemedText>
            <ThemedText style={styles.statLabel}>Today's Stops</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statValue}>{stats.completedRoutes}</ThemedText>
            <ThemedText style={styles.statLabel}>Completed Routes</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statValue}>{stats.completionRate}%</ThemedText>
            <ThemedText style={styles.statLabel}>Completion Rate</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statValue}>{stats.totalRoutes}</ThemedText>
            <ThemedText style={styles.statLabel}>Total Routes</ThemedText>
          </ThemedView>
        </ThemedView>
      </Animated.View>
      
      {/* Quick Actions */}
      <Animated.View style={[styles.card, card1Style]}>
        <Card>
          <CardHeader>
            <CardTitle>
              <ThemedText style={{fontSize: 18, fontWeight: 'bold', color: '#0f172a'}}>Quick Actions</ThemedText>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ThemedView style={styles.actionsGrid}>
              <TouchableOpacity 
                style={styles.actionItem}
                onPress={() => router.push('/(tabs)/route-creation')}
              >
                <ThemedView style={[styles.actionIcon, { backgroundColor: '#e0f2fe' }]}>
                  <IconSymbol name="plus" size={24} color="#0284c7" />
                </ThemedView>
                <ThemedText style={styles.actionText}>Create Route</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionItem}
                onPress={() => router.push('/(tabs)/analytics')}
              >
                <ThemedView style={[styles.actionIcon, { backgroundColor: '#dcfce7' }]}>
                  <IconSymbol name="chart.bar" size={24} color="#16a34a" />
                </ThemedView>
                <ThemedText style={styles.actionText}>Analytics</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionItem}
                onPress={() => router.push('/(tabs)/routes')}
              >
                <ThemedView style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
                  <IconSymbol name="paperplane.fill" size={24} color="#d97706" />
                </ThemedView>
                <ThemedText style={styles.actionText}>Routes</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionItem}
                onPress={() => router.push('/(tabs)/settings')}
              >
                <ThemedView style={[styles.actionIcon, { backgroundColor: '#f3e8ff' }]}>
                  <IconSymbol name="gear" size={24} color="#7e22ce" />
                </ThemedView>
                <ThemedText style={styles.actionText}>Settings</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </CardContent>
        </Card>
      </Animated.View>
      
      {/* Active Routes */}
      <Animated.View style={[card2Style]}>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText type="subtitle">Active Routes</ThemedText>
          <TouchableOpacity onPress={() => router.push('/(tabs)/routes')}>
            <ThemedText style={styles.seeAllText}>See All</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        {mockRoutes.map((route) => (
          <TouchableOpacity
            key={route.id}
            style={styles.routeItem}
            onPress={() => router.push('/(tabs)/route-optimization')}
          >
            <ThemedView style={styles.routeItemContent}>
              <ThemedText style={styles.routeName}>{route.name}</ThemedText>
              <ThemedView style={styles.routeDetails}>
                <ThemedText style={styles.routeDetailsText}>
                  {route.stops} stops • {route.estimatedTime} • {route.distance}
                </ThemedText>
                <ThemedView 
                  style={[
                    styles.statusBadge,
                    { 
                      backgroundColor: 
                        route.status === 'in_progress' ? '#0284c7' : 
                        route.status === 'pending' ? '#d97706' : '#16a34a'
                    }
                  ]}
                >
                  <ThemedText style={styles.statusText}>
                    {route.status === 'in_progress' ? 'In Progress' :
                      route.status === 'pending' ? 'Pending' : 'Completed'}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </TouchableOpacity>
        ))}
      </Animated.View>
      
      {/* Create New Route Button */}
      <Animated.View style={[styles.createRouteButtonContainer, card3Style]}>
        <TouchableOpacity 
          style={styles.createRouteButton}
          onPress={() => router.push('/(tabs)/route-creation')}
        >
          <IconSymbol name="plus" size={24} color="#ffffff" />
          <ThemedText style={styles.createRouteText}>Create New Route</ThemedText>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  statsOverview: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginVertical: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  card: {
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '48%',
    alignItems: 'center',
    marginVertical: 8,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#334155',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    color: '#0ea5e9',
    fontSize: 14,
    fontWeight: '500',
  },
  routeItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  routeItemContent: {
    padding: 16,
  },
  routeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  routeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeDetailsText: {
    fontSize: 14,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  createRouteButtonContainer: {
    marginTop: 12,
  },
  createRouteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  createRouteText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});