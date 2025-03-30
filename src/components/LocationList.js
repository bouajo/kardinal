import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const LocationList = ({ locations, onRemoveLocation, onReorderLocations, onEditLocation }) => {
  const renderItem = ({ item, index }) => (
    <View style={styles.locationItem}>
      <TouchableOpacity 
        style={styles.locationInfo}
        onPress={() => {
          console.log('Location item pressed', item, index);
          onEditLocation && onEditLocation(item, index);
        }}
      >
        <View style={styles.locationHeader}>
          <Text style={styles.locationName}>{item.name}</Text>
          {item.customerName && (
            <View style={styles.customerTag}>
              <Text style={styles.customerTagText}>{item.customerName}</Text>
            </View>
          )}
        </View>
        <Text style={styles.locationAddress} numberOfLines={1}>{item.address}</Text>
        
        {/* Display time slot if available */}
        {(item.startTime && item.endTime) && (
          <View style={styles.timeSlotContainer}>
            <FontAwesome name="clock-o" size={12} color="#666" />
            <Text style={styles.timeSlotText}>
              {item.startTime} - {item.endTime}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => {
            console.log('Edit button pressed', item, index);
            onEditLocation && onEditLocation(item, index);
          }}
        >
          <FontAwesome name="pencil" size={18} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => onRemoveLocation(index)}
        >
          <FontAwesome name="trash" size={18} color="#FF3B30" />
        </TouchableOpacity>
      </View>
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
    paddingRight: 10,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginRight: 8,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  customerTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  customerTagText: {
    fontSize: 12,
    color: '#1565C0',
    fontWeight: '500',
  },
  timeSlotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timeSlotText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    marginRight: 4,
  },
  removeButton: {
    padding: 8,
  },
});

export default LocationList; 