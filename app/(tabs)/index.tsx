import React, { useEffect } from 'react';
import { StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
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
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const heroScale = useSharedValue(0.95);
  const cardOpacity1 = useSharedValue(0);
  const cardOpacity2 = useSharedValue(0);
  const cardOpacity3 = useSharedValue(0);
  const cardTranslateY1 = useSharedValue(20);
  const cardTranslateY2 = useSharedValue(20);
  const cardTranslateY3 = useSharedValue(20);
  
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
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const pulseAnimation = useSharedValue(1);
  
  useEffect(() => {
    pulseAnimation.value = withRepeat(
      withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1, // Infinite repetitions
      true // Reverse
    );
  }, []);
  
  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnimation.value }],
    };
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      
      {/* Hero Section */}
      <Animated.View style={[styles.heroContainer, heroAnimatedStyle]}>
        <ThemedView style={styles.heroContent}>
          <Animated.View style={pulseStyle}>
            <IconSymbol 
              name="house.fill"
              size={60}
              color={Colors[colorScheme].tint}
              style={styles.heroIcon}
            />
          </Animated.View>
          <ThemedView style={styles.heroTextContainer}>
            <ThemedText type="title" style={styles.heroTitle}>Kardinal</ThemedText>
            <ThemedText style={styles.heroSubtitle}>Your everyday companion</ThemedText>
          </ThemedView>
        </ThemedView>
      </Animated.View>
      
      {/* Feature Cards */}
      <Animated.View style={[styles.card, card1Style]}>
        <TouchableOpacity 
          style={styles.cardTouchable}
          activeOpacity={0.9}
          onPress={handleCardPress}>
          <ThemedView style={styles.cardContent}>
            <ThemedView style={[styles.iconContainer, { backgroundColor: '#E6F7FF' }]}>
              <IconSymbol 
                name="paperplane.fill"
                size={24}
                color="#0A84FF"
              />
            </ThemedView>
            <ThemedView style={styles.cardTextContainer}>
              <ThemedText type="defaultSemiBold" style={styles.cardTitle}>Quick Actions</ThemedText>
              <ThemedText style={styles.cardDescription}>Start your journey with the most used features</ThemedText>
            </ThemedView>
            <IconSymbol 
              name="chevron.right"
              size={18}
              color={Colors[colorScheme].icon}
            />
          </ThemedView>
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.View style={[styles.card, card2Style]}>
        <TouchableOpacity 
          style={styles.cardTouchable}
          activeOpacity={0.9}
          onPress={handleCardPress}>
          <ThemedView style={styles.cardContent}>
            <ThemedView style={[styles.iconContainer, { backgroundColor: '#FFF3E6' }]}>
              <IconSymbol 
                name="house.fill"
                size={24}
                color="#FF9500"
              />
            </ThemedView>
            <ThemedView style={styles.cardTextContainer}>
              <ThemedText type="defaultSemiBold" style={styles.cardTitle}>Dashboard</ThemedText>
              <ThemedText style={styles.cardDescription}>View your personalized dashboard</ThemedText>
            </ThemedView>
            <IconSymbol 
              name="chevron.right"
              size={18}
              color={Colors[colorScheme].icon}
            />
          </ThemedView>
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.View style={[styles.card, card3Style]}>
        <TouchableOpacity 
          style={styles.cardTouchable}
          activeOpacity={0.9}
          onPress={() => {
            handleCardPress();
            router.push('/(tabs)/explore');
          }}>
          <ThemedView style={styles.cardContent}>
            <ThemedView style={[styles.iconContainer, { backgroundColor: '#E6FFF1' }]}>
              <IconSymbol 
                name="chevron.left.forwardslash.chevron.right"
                size={24}
                color="#30D158"
              />
            </ThemedView>
            <ThemedView style={styles.cardTextContainer}>
              <ThemedText type="defaultSemiBold" style={styles.cardTitle}>Explore</ThemedText>
              <ThemedText style={styles.cardDescription}>Discover all the features available</ThemedText>
            </ThemedView>
            <IconSymbol 
              name="chevron.right"
              size={18}
              color={Colors[colorScheme].icon}
            />
          </ThemedView>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Recent Activity Section */}
      <ThemedView style={styles.recentActivityContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Recent Activity</ThemedText>
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyStateText}>No recent activities yet.</ThemedText>
          <ThemedText style={styles.emptyStateSubtext}>Your activities will appear here.</ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 40,
  },
  heroContainer: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  heroContent: {
    padding: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIcon: {
    marginRight: 16,
  },
  heroTextContainer: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 32,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTouchable: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  recentActivityContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  emptyState: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});