import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_PLACES_API_KEY } from '@env';

const LocationSearch = ({ placeholder, onLocationSelect }) => {
  const searchRef = useRef(null);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState(GOOGLE_PLACES_API_KEY || '');

  useEffect(() => {
    console.log('GOOGLE_PLACES_API_KEY available:', !!apiKey);
    
    if (!apiKey) {
      console.error('No Google Places API key found!');
      setError('API key missing. Please check configuration.');
    }
    
    // Focus the input when component mounts
    setTimeout(() => {
      if (searchRef.current) {
        searchRef.current.focus();
      }
    }, 200);
  }, [apiKey]);

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <GooglePlacesAutocomplete
        ref={searchRef}
        placeholder={placeholder || 'Search for a location'}
        onPress={(data, details = null) => {
          console.log('Place selected:', data.description);
          if (details) {
            console.log('Selected place details:', details);
            const locationData = {
              name: details.name || data.description,
              address: details.formatted_address || data.description,
              location: {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              },
              placeId: data.place_id,
            };
            onLocationSelect(locationData);
          } else {
            console.log('No place details received');
            // Try to use the data we have
            if (data && data.description) {
              const locationData = {
                name: data.description,
                address: data.description,
                placeId: data.place_id,
              };
              console.log('Using fallback location data:', locationData);
              onLocationSelect(locationData);
            }
          }
        }}
        fetchDetails={true}
        query={{
          key: apiKey,
          language: 'en',
          types: 'address',
        }}
        onFail={(error) => {
          console.error('GooglePlacesAutocomplete error:', error);
          setError('Error loading places. Please try again.');
        }}
        styles={{
          container: styles.autocompleteContainer,
          textInputContainer: styles.textInputContainer,
          textInput: styles.textInput,
          listView: styles.listView,
          row: styles.row,
          separator: styles.separator,
          description: styles.description,
        }}
        enablePoweredByContainer={false}
        debounce={200}
        minLength={2}
        nearbyPlacesAPI="GooglePlacesSearch"
        textInputProps={{
          autoFocus: true,
          clearButtonMode: 'while-editing',
          placeholderTextColor: '#999',
          selectionColor: '#2196F3',
        }}
        listViewDisplayed="auto"
        keyboardShouldPersistTaps="always"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 15,
    zIndex: 9999,
  },
  autocompleteContainer: {
    flex: 0,
    width: '100%',
    zIndex: 9999,
  },
  textInputContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
    paddingHorizontal: 5,
  },
  textInput: {
    height: 50,
    color: '#333',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  listView: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 9999,
  },
  description: {
    color: '#333',
    fontSize: 15,
  },
  row: {
    backgroundColor: '#ffffff',
    padding: 13,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  errorText: {
    color: '#e53935',
    marginBottom: 8,
    backgroundColor: '#ffebee',
    padding: 8,
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default LocationSearch; 