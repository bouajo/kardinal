/**
 * This script specifically targets AsyncStorage issues by:
 * 1. Uninstalling and reinstalling the AsyncStorage package
 * 2. Clearing all caches (Metro, Gradle, CocoaPods)
 * 3. Rebuilding native modules
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

// Main fix AsyncStorage function
async function fixAsyncStorage() {
  try {
    log.header('Starting AsyncStorage Fix Process');

    // Get current AsyncStorage version from package.json
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const asyncStorageVersion = packageJson.dependencies['@react-native-async-storage/async-storage'];
    log.info(`Current AsyncStorage version: ${asyncStorageVersion}`);

    log.header('Uninstalling AsyncStorage');
    runCommand('npm uninstall @react-native-async-storage/async-storage');

    log.header('Cleaning Caches');
    // Clean Metro bundler cache
    deleteDirectory(path.join(os.homedir(), '.expo'));
    deleteDirectory('.expo');
    
    // Clean watchman cache
    runCommand('watchman watch-del-all', { ignoreError: true });

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

    log.header('Reinstalling AsyncStorage');
    // Reinstall AsyncStorage with the fixed version for Expo 52
    runCommand('npm install @react-native-async-storage/async-storage@1.21.0');

    log.header('Rebuilding Native Modules');
    
    // If iOS project exists, install pods
    if (fs.existsSync('ios')) {
      runCommand('cd ios && pod install');
    }

    log.header('AsyncStorage Fix Complete');
    log.success('All AsyncStorage fix steps have been completed.');
    log.info('Next steps:');
    log.info('  1. For Android: npm run clean-android');
    log.info('  2. For iOS: npm run clean-ios');
    log.info('  3. Or just test with: npx expo start --clear');

  } catch (error) {
    log.error('An unexpected error occurred during the AsyncStorage fix process:');
    log.error(error.message);
    process.exit(1);
  }
}

// Run the AsyncStorage fix process
fixAsyncStorage(); 