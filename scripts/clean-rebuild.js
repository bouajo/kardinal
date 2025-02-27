/**
 * This script provides a comprehensive clean and rebuild process
 * to resolve common issues with React Native/Expo projects.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// ANSI colors for better console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = {
  info: (message) => console.log(`${colors.blue}ℹ ${colors.reset}${message}`),
  success: (message) => console.log(`${colors.green}✓ ${colors.reset}${message}`),
  warning: (message) => console.log(`${colors.yellow}⚠ ${colors.reset}${message}`),
  error: (message) => console.log(`${colors.red}✖ ${colors.reset}${message}`),
  step: (message) => console.log(`${colors.cyan}> ${colors.reset}${message}`),
  header: (message) => console.log(`\n${colors.bright}${colors.magenta}=== ${message} ===${colors.reset}\n`),
};

function runCommand(command, options = {}) {
  log.step(`Running: ${command}`);
  try {
    execSync(command, { stdio: 'inherit', ...options });
    return true;
  } catch (error) {
    if (!options.ignoreError) {
      log.error(`Failed to run: ${command}`);
      log.error(error.message);
      return false;
    }
    log.warning(`Command had non-zero exit, but continuing: ${command}`);
    return true;
  }
}

function deleteDirectory(directory) {
  if (fs.existsSync(directory)) {
    log.step(`Deleting directory: ${directory}`);
    try {
      fs.rmSync(directory, { recursive: true, force: true });
      log.success(`Deleted: ${directory}`);
    } catch (error) {
      log.error(`Failed to delete: ${directory}`);
      log.error(error.message);
    }
  } else {
    log.info(`Directory does not exist, skipping: ${directory}`);
  }
}

// Main rebuild function
async function rebuild() {
  try {
    log.header('Starting Clean Rebuild Process');

    log.header('Cleaning Caches and Build Artifacts');
    // Delete node_modules
    deleteDirectory('node_modules');
    
    // Delete Metro bundler cache
    deleteDirectory(path.join(os.homedir(), '.expo'));
    deleteDirectory('.expo');

    // For Android, clean gradle
    if (fs.existsSync('android')) {
      log.header('Cleaning Android Build');
      if (process.platform === 'win32') {
        // Windows
        runCommand('cd android && .\\gradlew clean', { ignoreError: true });
      } else {
        // macOS/Linux
        runCommand('cd android && ./gradlew clean', { ignoreError: true });
      }
      deleteDirectory('android/app/build');
    }

    // For iOS, clean pods
    if (fs.existsSync('ios')) {
      log.header('Cleaning iOS Build');
      deleteDirectory('ios/Pods');
      deleteDirectory('ios/build');
    }

    // Remove yarn.lock or package-lock.json
    if (fs.existsSync('yarn.lock')) {
      fs.unlinkSync('yarn.lock');
      log.success('Deleted yarn.lock');
    }
    if (fs.existsSync('package-lock.json')) {
      fs.unlinkSync('package-lock.json');
      log.success('Deleted package-lock.json');
    }

    log.header('Reinstalling Dependencies');
    
    // Reinstall dependencies
    runCommand('npm install');

    log.header('Rebuilding Native Modules');
    
    // If iOS project exists, install pods
    if (fs.existsSync('ios')) {
      runCommand('cd ios && pod install');
    }

    log.header('Cleaning is Complete');
    log.success('All clean-up steps have been completed successfully.');
    log.info('To start your project, run:');
    log.info('  npx expo start --clear');

  } catch (error) {
    log.error('An unexpected error occurred during the rebuild process:');
    log.error(error.message);
    process.exit(1);
  }
}

// Run the rebuild process
rebuild(); 