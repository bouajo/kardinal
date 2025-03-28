import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Modal, Image, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const mockHistoryData = [
  {
    id: '1',
    name: 'Daily Commute',
    date: '2023-06-12',
    stops: 3,
    duration: '45 min',
    distance: '12.5 miles',
    locations: [
      { name: 'Home', address: '123 Main St' },
      { name: 'Coffee Shop', address: '456 Oak Ave' },
      { name: 'Office', address: '789 Business Pkwy' }
    ]
  },
  {
    id: '2',
    name: 'Weekend Delivery',
    date: '2023-06-10',
    stops: 5,
    duration: '1h 20min',
    distance: '22.8 miles',
    locations: [
      { name: 'Distribution Center', address: '100 Warehouse Blvd' },
      { name: 'Customer 1', address: '234 Pine St' },
      { name: 'Customer 2', address: '567 Maple Dr' },
      { name: 'Customer 3', address: '890 Cedar Ln' },
      { name: 'Distribution Center', address: '100 Warehouse Blvd' }
    ]
  },
  {
    id: '3',
    name: 'Downtown Route',
    date: '2023-06-08',
    stops: 4,
    duration: '55 min',
    distance: '15.3 miles',
    locations: [
      { name: 'Apartment', address: '111 Urban Ave' },
      { name: 'Post Office', address: '222 Mail St' },
      { name: 'Restaurant', address: '333 Food Blvd' },
      { name: 'Home', address: '111 Urban Ave' }
    ]
  },
];

const HistoryScreen = ({ navigation }) => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleRoutePress = (route) => {
    setSelectedRoute(route);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleReuseRoute = () => {
    // In a real app, this would copy the route to the home screen
    closeModal();
    alert(`Route "${selectedRoute.name}" has been set as your current route.`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.historyItem}
      onPress={() => handleRoutePress(item)}
    >
      <View style={styles.historyInfo}>
        <Text style={styles.routeName}>{item.name}</Text>
        <Text style={styles.routeDetails}>
          {item.date} • {item.stops} stops • {item.distance}
        </Text>
      </View>
      <FontAwesome name="chevron-right" size={16} color="#999" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Route History</Text>
      {mockHistoryData.length > 0 ? (
        <FlatList
          data={mockHistoryData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <FontAwesome name="history" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No saved routes yet</Text>
          <Text style={styles.emptySubtext}>Routes you optimize will appear here</Text>
        </View>
      )}

      {/* Route Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Route Details</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <FontAwesome name="times" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedRoute && (
              <>
                <View style={styles.mapPreview}>
                  <View style={styles.mapPlaceholder}>
                    <FontAwesome name="map" size={40} color="#2196F3" />
                    <Text style={styles.mapPlaceholderText}>Map Preview</Text>
                  </View>
                </View>

                <View style={styles.routeSummary}>
                  <Text style={styles.routeNameLarge}>{selectedRoute.name}</Text>
                  <Text style={styles.routeDate}>{selectedRoute.date}</Text>
                  
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <FontAwesome name="map-marker" size={16} color="#2196F3" />
                      <Text style={styles.statValue}>{selectedRoute.stops}</Text>
                      <Text style={styles.statLabel}>Stops</Text>
                    </View>
                    <View style={styles.statItem}>
                      <FontAwesome name="clock-o" size={16} color="#2196F3" />
                      <Text style={styles.statValue}>{selectedRoute.duration}</Text>
                      <Text style={styles.statLabel}>Duration</Text>
                    </View>
                    <View style={styles.statItem}>
                      <FontAwesome name="road" size={16} color="#2196F3" />
                      <Text style={styles.statValue}>{selectedRoute.distance}</Text>
                      <Text style={styles.statLabel}>Distance</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.stopsList}>
                  <Text style={styles.stopsTitle}>Stops</Text>
                  {selectedRoute.locations.map((location, index) => (
                    <View key={index} style={styles.stopItem}>
                      <View style={styles.stopNumber}>
                        <Text style={styles.stopNumberText}>{index + 1}</Text>
                      </View>
                      <View style={styles.stopInfo}>
                        <Text style={styles.stopName}>{location.name}</Text>
                        <Text style={styles.stopAddress}>{location.address}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.reuseButton} onPress={handleReuseRoute}>
                    <FontAwesome name="refresh" size={16} color="#FFF" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Reuse This Route</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    margin: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  routeDetails: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  mapPreview: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    marginTop: 10,
    color: '#666',
  },
  routeSummary: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  routeNameLarge: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  routeDate: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  stopsList: {
    padding: 16,
  },
  stopsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  stopItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stopNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stopNumberText: {
    color: 'white',
    fontWeight: 'bold',
  },
  stopInfo: {
    flex: 1,
  },
  stopName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  stopAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  reuseButton: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HistoryScreen; 