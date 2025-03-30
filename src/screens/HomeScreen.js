import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Text, SafeAreaView, Keyboard, KeyboardAvoidingView, Platform, Alert, Linking, Modal, TextInput } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';

// Import components
import LocationSearch from '../components/LocationSearch';
import LocationList from '../components/LocationList';
import AddLocationButton from '../components/AddLocationButton';
import OptimizeRouteButton from '../components/OptimizeRouteButton';
import HereMapService from '../services/HereMapService';
import GoogleMapsService from '../services/GoogleMapsService';
import StopDetailsModal from '../components/StopDetailsModal';

const HomeScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locations, setLocations] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showLocationsInSearch, setShowLocationsInSearch] = useState(false);
  const [isRouteOptimized, setIsRouteOptimized] = useState(false);
  const [showNavigationModal, setShowNavigationModal] = useState(false);
  const [showOptimizedList, setShowOptimizedList] = useState(false);
  const [routeInsights, setRouteInsights] = useState(null);
  const [routePolyline, setRoutePolyline] = useState(null);
  const [optimizationProvider, setOptimizationProvider] = useState(null);
  const [selectedStopIndex, setSelectedStopIndex] = useState(null);
  const [showStopDetailsModal, setShowStopDetailsModal] = useState(false);
  const [stopDetails, setStopDetails] = useState({
    timeslot: '',
    phoneNumber: '',
    notes: '',
  });
  const [selectedStop, setSelectedStop] = useState(null);
  const [showStopDetails, setShowStopDetails] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
    })();
  }, []);

  const handleLocationSelect = (location) => {
    setLocations([...locations, location]);
    setShowSearch(false);
    setShowLocationsInSearch(false);
    Keyboard.dismiss();

    // Animate to the newly added location
    if (mapRef.current && location.location) {
      mapRef.current.animateToRegion({
        latitude: location.location.latitude,
        longitude: location.location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }
  };

  const handleRemoveLocation = (index) => {
    const newLocations = [...locations];
    newLocations.splice(index, 1);
    setLocations(newLocations);
  };

  const toggleLocationsVisibility = () => {
    setShowLocationsInSearch(!showLocationsInSearch);
  };

  const handleSearchPress = () => {
    setShowSearch(true);
    setShowLocationsInSearch(false);
  };

  const handleOptimizeRoute = async () => {
    if (locations.length < 2) {
      Alert.alert('Not enough stops', 'You need at least 2 locations to optimize a route.');
      return;
    }

    // Validate location data before optimization
    const invalidLocations = locations.filter(
      loc => !loc.location || !loc.location.latitude || !loc.location.longitude
    );

    if (invalidLocations.length > 0) {
      console.error('Invalid locations found:', invalidLocations);
      Alert.alert(
        'Invalid Addresses', 
        'Some addresses don\'t have valid coordinates. Please remove them and try again.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsOptimizing(true);

    try {
      console.log('Optimizing route with HERE Maps API...');
      console.log(`Optimizing ${locations.length} locations:`, 
        locations.map(loc => ({name: loc.name, address: loc.address}))
      );
      
      // Use HERE Maps Service for optimization
      const result = await HereMapService.optimizeRoute(locations);
      setOptimizationProvider('HERE');
      
      // Ensure we have valid optimization results
      if (!result || !result.optimizedLocations || result.optimizedLocations.length === 0) {
        throw new Error('Invalid optimization result received');
      }
      
      // Update locations with optimized order
      setLocations(result.optimizedLocations);
      
      // Ensure we have valid metrics before using them
      if (!result.metrics) {
        throw new Error('No route metrics available in the optimization result');
      }
      
      // Create a safe version of stopTimes with defaults if values are missing
      const stopTimes = result.metrics.stopTimes || [];
      if (stopTimes.length < 2) {
        // Ensure we have at least start and end times
        const now = new Date();
        stopTimes[0] = now;
        stopTimes[1] = new Date(now.getTime() + 3600000); // 1 hour later as fallback
      }
      
      // Store route insights with safety checks
      setRouteInsights({
        totalTime: result.metrics.formattedDuration || 'N/A',
        totalDistance: result.metrics.formattedDistance || 'N/A',
        stopsCount: result.metrics.stopsCount || result.optimizedLocations.length,
        startTime: result.metrics.estimatedDepartureTime || new Date(),
        endTime: result.metrics.estimatedArrivalTime || new Date(),
        stopTimes: result.metrics.stopTimes || [],
        arrivalDetails: result.metrics.arrivalDetails || [],
        hasTrafficDelay: result.metrics.hasTrafficDelay || false,
        trafficDelay: result.metrics.trafficDelayFormatted || null,
        legs: result.metrics.legs || []
      });
      
      // If we have a polyline, decode it for the map
      if (result.polyline) {
        const decodedPolyline = HereMapService.decodeFlexiPolyline(result.polyline);
        if (decodedPolyline && decodedPolyline.length > 0) {
          setRoutePolyline(decodedPolyline);
        } else {
          console.warn('Failed to decode polyline, using straight lines instead');
          setRoutePolyline(null);
        }
      } else {
        setRoutePolyline(null);
      }
      
      // Set route as optimized to show Start Navigation button
      setIsRouteOptimized(true);
      setShowOptimizedList(false);
      
      // Fit map to show all markers
      fitMapToMarkers();
      
      // Show success message
      Alert.alert(
        'Route Optimized', 
        `Your route with ${result.optimizedLocations.length} stops has been optimized.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('HERE Maps route optimization failed:', error);
      Alert.alert(
        'Route Optimization Failed', 
        error.message || 'Failed to optimize route. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsOptimizing(false);
    }
  };

  const toggleOptimizedList = () => {
    setShowOptimizedList(!showOptimizedList);
  };

  const fitMapToMarkers = () => {
    if (mapRef.current && locations.length > 0) {
      const coordinates = locations.map(loc => ({
        latitude: loc.location.latitude,
        longitude: loc.location.longitude,
      }));
      
      if (currentLocation) {
        coordinates.push({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      }
      
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 50, bottom: 150, left: 50 },
        animated: true,
      });
    }
  };

  const handleStartDay = () => {
    if (locations.length < 1) {
      Alert.alert('No destinations', 'Add at least one destination to start your journey.');
      return;
    }
    
    setShowNavigationModal(true);
  };

  const openInGoogleMaps = () => {
    if (locations.length === 0) return;
    
    // Get the first destination
    const firstDestination = locations[0];
    
    // Create Google Maps URL
    let url = `https://www.google.com/maps/dir/?api=1`;
    
    // Add origin if we have current location
    if (currentLocation) {
      url += `&origin=${currentLocation.coords.latitude},${currentLocation.coords.longitude}`;
    }
    
    // Add destination
    url += `&destination=${firstDestination.location.latitude},${firstDestination.location.longitude}`;
    
    // Add waypoints if there are more locations
    if (locations.length > 1) {
      const waypoints = locations.slice(1).map(loc => 
        `${loc.location.latitude},${loc.location.longitude}`
      ).join('|');
      
      url += `&waypoints=${waypoints}`;
    }
    
    Linking.openURL(url).catch(err => 
      Alert.alert('Error', 'Could not open Google Maps')
    );
    
    setShowNavigationModal(false);
  };

  const openInWaze = () => {
    if (locations.length === 0) return;
    
    // Get the first destination
    const firstDestination = locations[0];
    
    // Create Waze URL
    const url = `https://waze.com/ul?ll=${firstDestination.location.latitude},${firstDestination.location.longitude}&navigate=yes`;
    
    Linking.openURL(url).catch(err => 
      Alert.alert('Error', 'Could not open Waze')
    );
    
    setShowNavigationModal(false);
  };

  const renderNavigationModal = () => (
    <Modal
      visible={showNavigationModal}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setShowNavigationModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Navigate with</Text>
          
          <TouchableOpacity 
            style={styles.navigationOption}
            onPress={openInGoogleMaps}
          >
            <FontAwesome name="map" size={24} color="#4285F4" />
            <Text style={styles.navigationText}>Google Maps</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navigationOption}
            onPress={openInWaze}
          >
            <FontAwesome name="map-marker" size={24} color="#33CCFF" />
            <Text style={styles.navigationText}>Waze</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => setShowNavigationModal(false)}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const initialRegion = {
    latitude: currentLocation?.coords?.latitude || 37.78825,
    longitude: currentLocation?.coords?.longitude || -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const getMapPoints = () => {
    if (routePolyline && routePolyline.length > 0) {
      return routePolyline;
    }
    
    return locations.map(loc => ({
      latitude: loc.location.latitude,
      longitude: loc.location.longitude,
    }));
  };

  const goToCurrentLocation = () => {
    if (mapRef.current && currentLocation) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }
  };

  const formatTime = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleMarkerPress = (index) => {
    // Set the selected stop index
    setSelectedStopIndex(index);
    
    // Load existing details if available
    const location = locations[index];
    setStopDetails({
      timeslot: location.timeslot || '',
      phoneNumber: location.phoneNumber || '',
      notes: location.notes || '',
    });
    
    // Show the details modal
    setShowStopDetailsModal(true);
  };

  const saveStopDetails = () => {
    if (selectedStopIndex === null) return;
    
    // Create a new locations array with the updated details
    const updatedLocations = [...locations];
    updatedLocations[selectedStopIndex] = {
      ...updatedLocations[selectedStopIndex],
      ...stopDetails
    };
    
    // Update the locations state
    setLocations(updatedLocations);
    
    // Close the modal
    setShowStopDetailsModal(false);
  };

  const handleStopPress = (location, index) => {
    console.log('Stop pressed:', { location, index });
    setSelectedStop({
      ...location,
      index,
      address: location.address || location.name,
      customerName: location.customerName || '',
      phoneNumber: location.phoneNumber || '',
      startTime: location.startTime || '',
      endTime: location.endTime || '',
      notes: location.notes || ''
    });
    setShowStopDetails(true);
  };

  const handleSaveStopDetails = (details) => {
    console.log('Saving stop details:', details);
    if (selectedStop && typeof selectedStop.index === 'number') {
      const updatedLocations = [...locations];
      updatedLocations[selectedStop.index] = {
        ...updatedLocations[selectedStop.index],
        customerName: details.customerName,
        phoneNumber: details.phoneNumber,
        startTime: details.startTime,
        endTime: details.endTime,
        notes: details.notes
      };
      setLocations(updatedLocations);
      setShowStopDetails(false);
    }
  };

  const handleEditLocationFromList = (location, index) => {
    console.log('Editing location from list:', { location, index });
    // Add more detailed logging
    console.log('Location details:', {
      address: location.address || location.name,
      customerName: location.customerName || '',
      phoneNumber: location.phoneNumber || '',
      startTime: location.startTime || '',
      endTime: location.endTime || '',
      notes: location.notes || ''
    });
    
    setSelectedStop({
      ...location,
      index,
      address: location.address || location.name,
      customerName: location.customerName || '',
      phoneNumber: location.phoneNumber || '',
      startTime: location.startTime || '',
      endTime: location.endTime || '',
      notes: location.notes || ''
    });
    
    // Added to debug modal visibility
    console.log('Setting showStopDetails to true');
    setShowStopDetails(true);
    console.log('Current showStopDetails state:', showStopDetails);
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <SafeAreaView style={styles.container}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {/* Show markers for all destinations */}
          {locations.map((location, index) => (
            location.location && (
              <Marker
                key={`marker-${index}`}
                coordinate={location.location}
                title={location.customerName || location.name || `Stop ${index + 1}`}
                description={location.address}
                onPress={() => handleStopPress(location, index)}
              >
                <View style={styles.markerContainer}>
                  <View style={styles.marker}>
                    <Text style={styles.markerText}>{index + 1}</Text>
                  </View>
                  {location.customerName && (
                    <View style={styles.customerBadge}>
                      <Text style={styles.customerBadgeText}>
                        {location.customerName.charAt(0)}
                      </Text>
                    </View>
                  )}
                </View>
              </Marker>
            )
          ))}
          
          {/* Draw polyline between points */}
          {locations.length > 1 && (
            <Polyline
              coordinates={getMapPoints()}
              strokeWidth={4}
              strokeColor="#2196F3"
              geodesic={true}
              lineDashPattern={[0]}
              lineJoin="round"
            />
          )}
        </MapView>

        {/* Search bar */}
        {showSearch ? (
          <View style={styles.searchContainer}>
            <View style={styles.searchHeaderContainer}>
              <TouchableOpacity 
                style={styles.searchBackButton}
                onPress={() => {
                  setShowSearch(false);
                  Keyboard.dismiss();
                }}
              >
                <FontAwesome name="arrow-left" size={18} color="#2196F3" />
              </TouchableOpacity>
              <Text style={styles.searchHeaderText}>Add Location</Text>
            </View>
            
            <View style={styles.locationSearchWrapper}>
              <LocationSearch 
                placeholder="Enter destination"
                onLocationSelect={(location) => {
                  console.log("Location selected from search:", location);
                  if (!location || !location.address) {
                    Alert.alert("Invalid Location", "Please select a valid address from the list.");
                    return;
                  }
                  
                  // If we have no coordinates but have an address, get coordinates
                  if (location.address && (!location.location || !location.location.latitude)) {
                    Alert.alert("Address selected", "The address was added but coordinates could not be determined. The route might not work correctly.");
                  }
                  
                  handleLocationSelect(location);
                }}
              />
            </View>
            
            {locations.length > 0 && (
              <TouchableOpacity 
                style={styles.toggleButton} 
                onPress={toggleLocationsVisibility}
              >
                <FontAwesome 
                  name={showLocationsInSearch ? "chevron-up" : "chevron-down"} 
                  size={16} 
                  color="#2196F3" 
                />
                <Text style={styles.toggleText}>
                  {showLocationsInSearch ? "Hide Stops" : "Show Stops"}
                </Text>
              </TouchableOpacity>
            )}
            
            {showLocationsInSearch && locations.length > 0 && (
              <View style={styles.searchLocationsList}>
                <LocationList 
                  locations={locations}
                  onRemoveLocation={handleRemoveLocation}
                  onEditLocation={handleEditLocationFromList}
                />
              </View>
            )}
          </View>
        ) : (
          <View style={styles.searchButton}>
            <TouchableOpacity 
              style={styles.searchButtonInner}
              onPress={handleSearchPress}
            >
              <FontAwesome name="search" size={16} color="#5d5d5d" />
              <Text style={styles.searchText}>
                {locations.length > 0 ? "Add another destination" : "Where to?"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Route insights panel */}
        {isRouteOptimized && routeInsights && (
          <View style={styles.insightsContainer}>
            <View style={styles.insightsHeader}>
              <Text style={styles.insightsTitle}>Route Summary</Text>
              <View style={styles.headerRight}>
                {optimizationProvider && (
                  <Text style={styles.providerText}>
                    via {optimizationProvider}
                  </Text>
                )}
                <TouchableOpacity style={styles.toggleButton} onPress={toggleOptimizedList}>
                  <Text style={styles.toggleButtonText}>
                    {showOptimizedList ? "Hide Details" : "Show Details"}
                  </Text>
                  <FontAwesome 
                    name={showOptimizedList ? "chevron-up" : "chevron-down"} 
                    size={16} 
                    color="#2196F3" 
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.insightsContent}>
              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  <FontAwesome name="clock-o" size={18} color="#2196F3" />
                </View>
                <Text style={styles.insightText}>
                  Total time: {routeInsights.totalTime}
                  {routeInsights.hasTrafficDelay && (
                    <Text style={styles.trafficDelayText}> (inc. {routeInsights.trafficDelay} traffic)</Text>
                  )}
                </Text>
              </View>
              
              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  <FontAwesome name="road" size={18} color="#2196F3" />
                </View>
                <Text style={styles.insightText}>
                  Total distance: {routeInsights.totalDistance}
                </Text>
              </View>
              
              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  <FontAwesome name="map-marker" size={18} color="#2196F3" />
                </View>
                <Text style={styles.insightText}>
                  Stops: {routeInsights.stopsCount}
                </Text>
              </View>
              
              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  <FontAwesome name="calendar" size={18} color="#2196F3" />
                </View>
                <Text style={styles.insightText}>
                  {formatDate(routeInsights.startTime)} · {formatTime(routeInsights.startTime)} - {formatTime(routeInsights.endTime)}
                </Text>
              </View>
            </View>
            
            {showOptimizedList && (
              <View style={styles.optimizedListContainer}>
                {routeInsights.arrivalDetails && routeInsights.arrivalDetails.length > 0 ? (
                  <>
                    <View style={styles.divider} />
                    <Text style={styles.sectionTitle}>Route Timeline</Text>
                    <View style={styles.stopsTimeline}>
                      {/* Vertical line spanning all stops */}
                      <View style={styles.timelineVerticalLine} />
                      
                      {routeInsights.arrivalDetails.map((detail, index) => {
                        // Find the corresponding location to access custom details
                        const locationData = routeInsights.optimizedLocations && routeInsights.optimizedLocations[index - (detail.isStart ? 1 : 0)];
                        
                        return (
                          <View key={`detail-${index}`} style={styles.timelineItem}>
                            <View style={styles.timelineLeft}>
                              <View style={[
                                styles.timelineDot, 
                                detail.isStart ? styles.timelineDotStart : {}
                              ]}>
                                <Text style={styles.timelineDotText}>
                                  {detail.isStart ? 'S' : detail.stopNumber - 1}
                                </Text>
                              </View>
                            </View>
                            
                            <View style={styles.timelineContent}>
                              <Text style={styles.locationName}>{detail.locationName}</Text>
                              <Text style={styles.arrivalTime}>
                                {formatTime(detail.arrivalTime)}
                                {!detail.isStart && detail.drivingTime && (
                                  <Text style={styles.drivingDetails}>
                                     · {detail.drivingTime} drive
                                    {detail.distance && ` · ${detail.distance.toFixed(1)} km`}
                                  </Text>
                                )}
                              </Text>
                              
                              {/* Show additional details if available */}
                              {locationData && (
                                <View style={styles.additionalDetails}>
                                  {locationData.customerName && (
                                    <Text style={styles.additionalDetailText}>
                                      <Text style={styles.detailLabel}>Customer: </Text>
                                      {locationData.customerName}
                                    </Text>
                                  )}
                                  {(locationData.startTime && locationData.endTime) && (
                                    <Text style={styles.additionalDetailText}>
                                      <Text style={styles.detailLabel}>Time slot: </Text>
                                      {locationData.startTime} - {locationData.endTime}
                                    </Text>
                                  )}
                                  {locationData.phoneNumber && (
                                    <Text style={styles.additionalDetailText}>
                                      <Text style={styles.detailLabel}>Phone: </Text>
                                      {locationData.phoneNumber}
                                    </Text>
                                  )}
                                  {locationData.notes && (
                                    <Text style={styles.additionalDetailText}>
                                      <Text style={styles.detailLabel}>Notes: </Text>
                                      {locationData.notes}
                                    </Text>
                                  )}
                                </View>
                              )}
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </>
                ) : (
                  <LocationList 
                    locations={locations}
                    onRemoveLocation={handleRemoveLocation}
                    onEditLocation={handleEditLocationFromList}
                  />
                )}
              </View>
            )}
          </View>
        )}
        
        {/* Location list on the main screen - only shown if not optimized */}
        {!showSearch && locations.length > 0 && !isRouteOptimized && (
          <View style={styles.locationsContainer}>
            <LocationList 
              locations={locations}
              onRemoveLocation={handleRemoveLocation}
              onEditLocation={handleEditLocationFromList}
            />
          </View>
        )}
        
        {/* Current location button */}
        <TouchableOpacity 
          style={styles.myLocationButton}
          onPress={goToCurrentLocation}
        >
          <FontAwesome name="location-arrow" size={20} color="#2196F3" />
        </TouchableOpacity>
        
        {/* Button container with appropriate buttons */}
        {!showSearch && (
          <View style={styles.buttonsContainer}>
            {locations.length === 0 ? (
              // If no locations, show Add Destination button centered
              <AddLocationButton 
                onPress={handleSearchPress}
                title="Add Destination"
              />
            ) : isRouteOptimized ? (
              // Show Start the Day button after route is optimized
              <TouchableOpacity 
                style={styles.startDayButton}
                onPress={handleStartDay}
              >
                <FontAwesome name="play-circle" size={18} color="#FFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Start Navigation</Text>
              </TouchableOpacity>
            ) : (
              // Show Optimize button if not yet optimized
              locations.length >= 2 && (
                <OptimizeRouteButton 
                  onPress={handleOptimizeRoute}
                  isLoading={isOptimizing}
                />
              )
            )}
          </View>
        )}

        {/* Navigation app selection modal */}
        {renderNavigationModal()}

        {/* Stop details modal */}
        <StopDetailsModal
          visible={showStopDetails}
          onClose={() => setShowStopDetails(false)}
          onSave={handleSaveStopDetails}
          stopData={selectedStop}
          initialDetails={{
            customerName: selectedStop?.customerName || '',
            phoneNumber: selectedStop?.phoneNumber || '',
            startTime: selectedStop?.startTime || '',
            endTime: selectedStop?.endTime || '',
            notes: selectedStop?.notes || ''
          }}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  searchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 9999,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: Platform.OS === 'ios' ? 50 : 10,
    paddingBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    right: 15,
    zIndex: 10,
  },
  searchButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#555',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f0f8ff',
    marginTop: 10,
    marginHorizontal: 15,
    zIndex: 100,
    elevation: 100,
    alignSelf: 'flex-start',
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#2196F3',
    marginRight: 5,
    fontWeight: '500',
  },
  toggleText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  searchLocationsList: {
    marginTop: 10,
    maxHeight: 250,
    zIndex: 95,
    elevation: 95,
    marginHorizontal: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  locationsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 90,
    zIndex: 1,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
    zIndex: 1,
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: 'white',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  markerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  customerBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  customerBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  startDayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
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
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
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
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  navigationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  navigationText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  cancelButton: {
    marginTop: 15,
    padding: 15,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  insightsContainer: {
    position: 'absolute',
    left: 15,
    right: 15,
    top: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  insightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginRight: 10,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  insightsContent: {
    marginBottom: 10,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightIcon: {
    marginRight: 10,
    width: 22,
  },
  insightText: {
    fontSize: 14,
    color: '#555',
  },
  optimizedListContainer: {
    marginTop: 12,
    paddingTop: 2,
    maxHeight: 300,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  stopsTimeline: {
    position: 'relative',
    paddingBottom: 10,
    paddingTop: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
    position: 'relative',
  },
  timelineLeft: {
    width: 40,
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },
  timelineDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timelineDotStart: {
    backgroundColor: '#4CAF50',
  },
  timelineLine: {
    position: 'absolute',
    top: 26,
    left: 20,
    width: 2,
    height: '100%',
    backgroundColor: '#ddd',
    zIndex: 1,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 16,
    paddingTop: 2,
  },
  locationName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  arrivalTime: {
    fontSize: 13,
    color: '#666',
  },
  drivingDetails: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  timelineDotText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
  },
  trafficDelayText: {
    fontSize: 13,
    color: '#FF3B30',
    fontWeight: '500',
  },
  timelineVerticalLine: {
    position: 'absolute',
    top: 0,
    left: 20,
    width: 2,
    height: '100%',
    backgroundColor: '#ddd',
  },
  searchHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  searchBackButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
  },
  searchHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  locationSearchWrapper: {
    width: '100%',
    zIndex: 9999,
    elevation: 9999,
  },
  stopDetailsContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stopDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsForm: {
    marginBottom: 20,
  },
  detailsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  detailsInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  detailsButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  detailsButton: {
    borderRadius: 8,
    padding: 12,
    minWidth: '45%',
    alignItems: 'center',
  },
  cancelDetailButton: {
    backgroundColor: '#f44336',
  },
  cancelDetailButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  saveDetailButton: {
    backgroundColor: '#4CAF50',
  },
  saveDetailButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  additionalDetails: {
    marginTop: 4,
  },
  additionalDetailText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  detailLabel: {
    fontWeight: '600',
    color: '#555',
  },
});

export default HomeScreen; 