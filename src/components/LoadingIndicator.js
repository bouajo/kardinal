import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';

const LoadingIndicator = ({ message }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2196F3" />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 9999,
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});

export default LoadingIndicator; 