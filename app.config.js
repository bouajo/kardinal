import 'dotenv/config';

export default {
  name: "Route Optimizer",
  slug: "route-optimizer",
  version: "1.0.0",
  orientation: "portrait",
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.yourcompany.routeoptimizer",
    config: {
      googleMapsApiKey: process.env.GOOGLE_PLACES_API_KEY
    },
    infoPlist: {
      NSLocationWhenInUseUsageDescription: "This app needs access to location to show your current position on the map and optimize routes.",
      NSLocationAlwaysUsageDescription: "This app needs access to location to show your current position on the map and optimize routes."
    }
  },
  android: {
    package: "com.yourcompany.routeoptimizer",
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_PLACES_API_KEY
      }
    },
    permissions: [
      "ACCESS_COARSE_LOCATION",
      "ACCESS_FINE_LOCATION"
    ]
  },
  plugins: [
    [
      "expo-location",
      {
        "locationAlwaysAndWhenInUsePermission": "Allow Route Optimizer to use your location to show your position on the map and optimize routes."
      }
    ]
  ]
}; 