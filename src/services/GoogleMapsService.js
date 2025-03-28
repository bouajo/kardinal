import { GOOGLE_MAPS_API_KEY, GOOGLE_PLACES_API_KEY } from '@env';

class GoogleMapsService {
  constructor() {
    // Debug the API key loading
    console.log('Maps API key value:', GOOGLE_MAPS_API_KEY);
    console.log('Places API key value:', GOOGLE_PLACES_API_KEY);
    
    // Use the Places API key by default
    this.apiKey = GOOGLE_PLACES_API_KEY ? GOOGLE_PLACES_API_KEY.trim() : '';
    console.log('Using API key:', this.apiKey);
    
    // API endpoints
    this.directionsUrl = 'https://maps.googleapis.com/maps/api/directions/json';
    this.distanceMatrixUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json';
  }

  /**
   * Optimize the order of waypoints for the most efficient route
   * @param {Array} locations Array of location objects
   * @returns {Promise} Promise resolving to optimized route data
   */
  async optimizeRoute(locations) {
    if (!locations || locations.length < 2) {
      throw new Error('At least 2 locations are required to optimize a route');
    }

    try {
      console.log("Using API key:", this.apiKey);
      
      // Format waypoints for the Directions API
      const origin = locations[0];
      const destination = locations[locations.length - 1];
      const waypoints = locations.slice(1, -1).map(loc => 
        `${loc.location.latitude},${loc.location.longitude}`
      ).join('|');
      
      // Build the directions URL
      let url = `${this.directionsUrl}?origin=${origin.location.latitude},${origin.location.longitude}`;
      url += `&destination=${destination.location.latitude},${destination.location.longitude}`;
      
      if (waypoints.length > 0) {
        url += `&waypoints=optimize:true|${waypoints}`;
      }
      
      url += `&key=${this.apiKey}`;
      
      console.log("Request URL:", url);

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status !== 'OK') {
        console.error("API Error response:", data);
        throw new Error(data.error_message || `Error: ${data.status}`);
      }
      
      // If we have waypoint_order in the response, use it to reorder locations
      let reorderedLocations = [...locations];
      
      if (data.routes && data.routes[0] && data.routes[0].waypoint_order) {
        // First point is always origin
        reorderedLocations = [origin];
        
        // Add waypoints in the optimized order
        const { waypoint_order } = data.routes[0];
        waypoint_order.forEach(index => {
          reorderedLocations.push(locations[index + 1]); // +1 because we excluded the origin
        });
        
        // Last point is always destination
        if (reorderedLocations.length < locations.length) {
          reorderedLocations.push(destination);
        }
      }
      
      // Calculate route metrics
      let totalDuration = 0;
      let totalDistance = 0;
      
      if (data.routes && data.routes[0] && data.routes[0].legs) {
        const legs = data.routes[0].legs;
        legs.forEach(leg => {
          totalDuration += leg.duration.value; // seconds
          totalDistance += leg.distance.value; // meters
        });
      }
      
      // Calculate estimated arrival times for each stop
      const startTime = new Date();
      const stopTimes = [startTime];
      
      let currentTime = startTime.getTime();
      
      if (data.routes && data.routes[0] && data.routes[0].legs) {
        const legs = data.routes[0].legs;
        
        for (let i = 0; i < legs.length; i++) {
          // Add travel time to current time
          currentTime += legs[i].duration.value * 1000; // convert seconds to milliseconds
          
          // Add 5 minutes stop time for each location (except the last one)
          if (i < legs.length - 1) {
            currentTime += 5 * 60 * 1000; // 5 minutes in milliseconds
          }
          
          stopTimes.push(new Date(currentTime));
        }
      }
      
      // Convert metrics to user-friendly format
      const hours = Math.floor(totalDuration / 3600);
      const minutes = Math.floor((totalDuration % 3600) / 60);
      const formattedDuration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
      
      const distanceInKm = totalDistance / 1000;
      const formattedDistance = distanceInKm.toFixed(1) + ' km';
      
      return {
        optimizedLocations: reorderedLocations,
        routeData: data,
        metrics: {
          totalDuration: totalDuration,
          totalDistance: totalDistance,
          formattedDuration,
          formattedDistance,
          stopsCount: reorderedLocations.length,
          stopTimes: stopTimes
        },
        polyline: data.routes[0]?.overview_polyline?.points || null
      };
    } catch (error) {
      console.error('Error optimizing route with Google Maps API:', error);
      throw error;
    }
  }
  
  /**
   * Decode a Google Maps encoded polyline
   * @param {String} encoded The encoded polyline
   * @return {Array} Array of latitude, longitude pairs
   */
  decodePolyline(encoded) {
    if (!encoded) return [];
    
    const poly = [];
    let index = 0, lat = 0, lng = 0;

    while (index < encoded.length) {
      let b, shift = 0, result = 0;
      
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;
      
      shift = 0;
      result = 0;
      
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;
      
      poly.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    
    return poly;
  }
}

export default new GoogleMapsService(); 