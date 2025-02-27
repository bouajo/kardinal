import { Platform, StyleSheet } from 'react-native';
import { ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const createStyleSheet = (styles: StyleSheet.NamedStyles<any>) => {
  return StyleSheet.create(styles);
};

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatTime(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}