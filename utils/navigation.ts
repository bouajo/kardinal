// utils/navigation.ts
import { router } from 'expo-router';

/**
 * Navigate to auth routes with type safety
 */
export function navigateToAuth(screen: 'login' | 'signup'): void {
  // For auth routes, we can directly navigate with string paths
  // @ts-expect-error - Expo Router typing issue
  router.push(`/${screen}`);
}

/**
 * Navigate to tab routes with type safety
 */
export function navigateToTab(screen: 'index' | 'explore' | 'map' | 'profile' | 'routes'): void {
  // @ts-expect-error - Expo Router typing issue
  router.push(`/(tabs)/${screen}`);
}

/**
 * Go back to previous screen
 */
export function goBack(): void {
  router.back();
} 