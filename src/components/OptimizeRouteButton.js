import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const OptimizeRouteButton = ({ onPress, title, isLoading }) => {
  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <>
          <FontAwesome name="magic" size={16} color="#FFF" style={styles.icon} />
          <Text style={styles.text}>{title || 'Optimize Route'}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default OptimizeRouteButton; 