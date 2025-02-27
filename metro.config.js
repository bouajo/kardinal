const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project root directory
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// Enable path resolution for aliases
config.resolver.extraNodeModules = {
  '@': path.resolve(projectRoot),
};

module.exports = config; 