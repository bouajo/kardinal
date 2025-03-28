import { HERE_API_KEY } from '@env';

class HereMapService {
  constructor() {
    console.log('HERE API key:', HERE_API_KEY ? 'Available' : 'Missing');
    this.apiKey = HERE_API_KEY;
    this.baseUrl = 'https://router.hereapi.com/v8';
    this.matrixUrl = 'https://matrix.router.hereapi.com/v8/matrix';
    this.waypointSequenceUrl = 'https://wse.ls.hereapi.com/2/findsequence.json';
    this.routeUrl = `${this.baseUrl}/routes`;
  }

  /**
   * Calculate route between waypoints using HERE Routing API
   * @param {Array} locations Array of location objects with coordinates
   * @returns {Object} Route data
   */
  async calculateRoute(locations) {
    if (!locations || locations.length < 2) {
      throw new Error('At least 2 locations are required for route calculation');
    }

    try {
      // Format origin, destination, and via points
      const origin = `${locations[0].location.latitude},${locations[0].location.longitude}`;
      const destination = `${locations[locations.length - 1].location.latitude},${locations[locations.length - 1].location.longitude}`;
      const viaPoints = locations.slice(1, -1).map(loc => 
        `${loc.location.latitude},${loc.location.longitude}`
      ).join('&via=');

      const url = `${this.routeUrl}?` +
        `apiKey=${this.apiKey}&` +
        `origin=${origin}&` +
        `destination=${destination}` +
        (viaPoints ? `&via=${viaPoints}` : '') +
        `&transportMode=car&` +
        `return=polyline,summary,actions,instructions`;

      console.log('Route calculation URL:', url);

      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HERE API error: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Route calculation failed:', error);
      throw error;
    }
  }

  /**
   * Optimize a route with multiple stops using HERE Waypoint Sequence API
   * @param {Array} locations Array of location objects with coordinates
   * @returns {Object} Optimized route data
   */
  async optimizeRoute(locations) {
    if (!locations || locations.length < 2) {
      throw new Error('At least 2 locations are required for route optimization');
    }

    console.log(`Optimizing route with ${locations.length} locations`);
    
    try {
      // For 3 or fewer locations, calculate route without optimization
      if (locations.length <= 3) {
        console.log('Only 3 or fewer locations - calculating route without optimization');
        const routeData = await this.calculateRoute(locations);
        
        return {
          optimizedLocations: locations,
          routeData,
          metrics: this.processRouteResponse(routeData, locations)
        };
      }
      
      // For 4+ locations, use optimization
      const optimizedIndices = await this.optimizeWaypointSequence(locations);
      
      // Reorder locations according to the optimization result
      const optimizedLocations = this.reorderLocations(locations, optimizedIndices);
      
      console.log('Waypoints optimized successfully.');
      
      // Calculate route with optimized waypoints
      const routeData = await this.calculateRoute(optimizedLocations);
      
      return {
        optimizedLocations,
        routeData,
        metrics: this.processRouteResponse(routeData, optimizedLocations)
      };
    } catch (error) {
      console.error('Route optimization failed:', error);
      // If optimization fails, try calculating a normal route
      console.log('Optimization failed, calculating normal route...');
      const routeData = await this.calculateRoute(locations);
      return {
        optimizedLocations: locations,
        routeData,
        metrics: this.processRouteResponse(routeData, locations)
      };
    }
  }
  
  /**
   * Process the route response to extract metrics and format the return data
   * @param {Object} routeData The route data from HERE API
   * @param {Array} locations The locations used in the route
   * @returns {Object} Processed route data with metrics
   */
  processRouteResponse(routeData, locations) {
    if (!routeData || !routeData.routes || !routeData.routes[0]) {
      throw new Error('Invalid route data received');
    }

    const route = routeData.routes[0];
    const section = route.sections[0];

    return {
      totalTime: this.formatDuration(section.summary.duration),
      totalDistance: this.formatDistance(section.summary.length),
      formattedDuration: this.formatDuration(section.summary.duration),
      formattedDistance: this.formatDistance(section.summary.length),
      stopsCount: locations.length,
      estimatedDepartureTime: new Date(),
      estimatedArrivalTime: new Date(Date.now() + section.summary.duration * 1000),
      polyline: section.polyline,
      legs: section.actions || []
    };
  }
  
  /**
   * Format a duration in seconds to a human-readable string
   * @param {Number} seconds Duration in seconds
   * @returns {String} Formatted duration string (e.g. "2h 30m" or "45m")
   */
  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  }
  
  formatDistance(meters) {
    const km = meters / 1000;
    return `${km.toFixed(1)}km`;
  }
  
  /**
   * Decode a HERE Maps flexible polyline
   * @param {String} encoded The encoded polyline
   * @return {Array} Array of latitude, longitude pairs
   */
  decodeFlexiPolyline(encoded) {
    if (!encoded || encoded.length === 0) return [];
    
    try {
      // More robust implementation for flexible polyline decoding
      const DECODING_TABLE = [
        62, -1, -1, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1,
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
        22, 23, 24, 25, -1, -1, -1, -1, 63, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
        36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
      ];
      
      // Helper functions for decoding
      function decodeChar(char) {
        const charCode = char.charCodeAt(0) - 45;
        if (charCode < 0 || charCode >= DECODING_TABLE.length) return -1;
        return DECODING_TABLE[charCode];
      }
      
      function decodeUnsignedValues(encoded) {
        const result = [];
        let shift = 0;
        let value = 0;
  
        for (let i = 0; i < encoded.length; i++) {
          const digit = decodeChar(encoded[i]);
          if (digit < 0) continue;
          
          value |= (digit & 0x1f) << shift;
          if ((digit & 0x20) === 0) {
            result.push(value);
            value = 0;
            shift = 0;
          } else {
            shift += 5;
          }
        }
        
        return result;
      }
      
      function decodeSignedValues(encoded) {
        const unsignedValues = decodeUnsignedValues(encoded);
        return unsignedValues.map(value => {
          const isNegative = (value & 1) === 1;
          const result = isNegative ? ~(value >>> 1) : (value >>> 1);
          return result;
        });
      }
      
      // Basic error handling - if the polyline is too short or malformed
      if (encoded.length < 2) {
        console.warn('Polyline too short to decode');
        return [];
      }
      
      // Extract header
      const headerValue = decodeUnsignedValues(encoded.substring(0, 1))[0];
      const precision = headerValue & 15;
      const thirdDimension = (headerValue >> 4) & 7;
      const thirdDimPrecision = (headerValue >> 7) & 15;
      
      // Calculate scales
      const latLngScale = Math.pow(10, precision);
      const thirdDimScale = Math.pow(10, thirdDimPrecision);
      
      // Skip header
      const encodedPositions = encoded.substring(1);
      
      // Decode values
      const positions = decodeSignedValues(encodedPositions);
      
      // The number of coordinates depends on the third dimension
      // 0: No third dimension, just lat/lng pairs
      // 1-7: Third dimension exists, meaning each point is lat, lng, third-dim
      const coordsPerPoint = thirdDimension ? 3 : 2;
      
      // Create the final coordinate array
      const coordinates = [];
      let lat = 0, lng = 0;
      
      for (let i = 0; i < positions.length; i += coordsPerPoint) {
        if (i + 1 >= positions.length) break; // Ensure we have at least a lat/lng pair
        
        // Delta decode
        lat += positions[i];
        lng += positions[i + 1];
        
        // Scale
        const point = {
          latitude: lat / latLngScale,
          longitude: lng / latLngScale
        };
        
        coordinates.push(point);
      }
      
      return coordinates;
    } catch (error) {
      console.error('Error decoding flexible polyline:', error);
      return [];
    }
  }

  /**
   * Reorganize locations to match optimized order
   * @param {Array} originalLocations The original locations array
   * @param {Array} optimizedIndices The indices of optimized order
   * @returns {Array} Locations array in optimized order
   */
  reorderLocations(locations, optimizedIndices) {
    return optimizedIndices.map(index => ({
      ...locations[index],
      originalIndex: index
    }));
  }

  /**
   * Optimize the waypoint sequence using HERE Waypoint Sequence API
   * @param {Array} locations Array of location objects with coordinates
   * @returns {Object} Optimization data
   */
  async optimizeWaypointSequence(locations) {
    if (!this.apiKey) {
      throw new Error('HERE API key is not configured');
    }

    if (!locations || locations.length < 3) {
      throw new Error('Not enough waypoints for optimization. Minimum is 3.');
    }

    console.log(`Optimizing sequence for ${locations.length} locations`);

    // Format waypoints for the API with correct coordinate format
    const start = `start=${locations[0].location.latitude},${locations[0].location.longitude}`;
    
    // Format remaining waypoints as destinations
    const destinations = locations.slice(1).map((loc, index) => 
      `destination${index + 1}=${loc.location.latitude},${loc.location.longitude}`
    ).join('&');

    const url = `${this.waypointSequenceUrl}?` + 
      `apiKey=${this.apiKey}&` +
      `mode=fastest;car;traffic:disabled&` +
      `${start}&${destinations}&` +
      `improveFor=time`;

    console.log('Optimize waypoint sequence URL:', url);

    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log('HERE API optimization response:', JSON.stringify(data, null, 2));

      // Check for actual errors in the response
      if (!response.ok || (data.errors && data.errors.length > 0)) {
        console.error('HERE API error response:', JSON.stringify(data));
        throw new Error(`HERE API error: ${JSON.stringify(data.errors)}`);
      }

      if (!data.results || !data.results[0] || !data.results[0].waypoints) {
        throw new Error('Invalid response format from HERE API');
      }

      // Extract the optimized sequence
      const optimizedWaypoints = data.results[0].waypoints;
      
      // Create a mapping from waypoint ID to index
      const waypointMap = {
        'start': 0
      };
      
      // Add destination mappings
      locations.slice(1).forEach((_, index) => {
        waypointMap[`destination${index + 1}`] = index + 1;
      });
      
      // Convert the sequence to indices
      return optimizedWaypoints.map(wp => waypointMap[wp.id]);
      
    } catch (error) {
      console.error('Route optimization failed:', error);
      throw error;
    }
  }
}

export default new HereMapService(); 