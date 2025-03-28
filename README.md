# Route Optimizer App

A React Native mobile application for drivers to optimize multi-stop routes. Built with Expo, React Native, Google Places API, and HERE Maps.

## Features

- Display maps with current location
- Search for addresses using Google Places Autocomplete
- Add and remove multiple stops
- Visualize routes on the map
- (Coming soon) Route optimization

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- An Android or iOS device with Expo Go installed, or emulators

## API Keys Required

- Google Places API key
- HERE Maps API key

## Getting Started

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Set up environment variables in `.env` file

```
HERE_API_KEY=your_here_api_key_here
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
```

4. Update the API keys in `app.json`

5. Start the Expo development server

```bash
npm start
```

6. Scan the QR code with Expo Go app on your device, or press 'a' for Android emulator or 'i' for iOS simulator

## Project Structure

```
/assets              # App icons and splash screen resources
/src
  /components        # Reusable UI components
  /screens           # App screens
  /navigation        # Navigation configuration
  /services          # API services and business logic
  /utils             # Utility functions
```

## Development Phases

### MVP Phase 1: Project setup and basic map display ✓
- Set up React Native with Expo
- Configure Google Maps
- Display current location

### MVP Phase 2: Location input with Google Places ✓
- Implement location search with autocomplete
- Allow adding multiple destinations
- Display location list

### MVP Phase 3: Route calculation (In progress)
- Implement route calculation between waypoints
- Display route on map
- Show estimated time and distance

### MVP Phase 4: Multi-stop route support (Upcoming)
- Add UI for managing multiple waypoints
- Calculate routes with multiple stops
- Add reordering capability

### MVP Phase 5: Route optimization (Upcoming)
- Implement algorithm to optimize stop order
- Add UI for optimization controls
- Calculate and display optimized routes

## Dependencies

- React Native
- Expo
- React Navigation
- Google Maps / React Native Maps
- Google Places Autocomplete
- HERE Maps API

## License

MIT
