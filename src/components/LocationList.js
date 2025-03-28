import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const LocationList = ({ locations, onRemoveLocation, onReorderLocations }) => {
  const renderItem = ({ item, index }) => (
    <View style={styles.locationItem}>
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationAddress} numberOfLines={1}>{item.address}</Text>
      </View>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => onRemoveLocation(index)}
      >
        <FontAwesome name="remove" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  if (!locations || locations.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Route</Text>
      <FlatList
        data={locations}
        renderItem={renderItem}
        keyExtractor={(item, index) => `location-${index}`}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  list: {
    maxHeight: 250,
  },
  listContent: {
    paddingVertical: 4,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    padding: 8,
  },
});

export default LocationList; 