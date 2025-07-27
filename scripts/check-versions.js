#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  console.error(`${colors.red}ERROR: ${message}${colors.reset}`);
}

function success(message) {
  console.log(`${colors.green}✓ ${message}${colors.reset}`);
}

function warning(message) {
  console.log(`${colors.yellow}⚠ ${message}${colors.reset}`);
}

function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    error(`Failed to read ${filePath}: ${err.message}`);
    return null;
  }
}

function readCargoToml() {
  try {
    const content = fs.readFileSync('./src-tauri/Cargo.toml', 'utf8');
    const versionMatch = content.match(/version = "([^"]+)"/);
    return versionMatch ? versionMatch[1] : null;
  } catch (err) {
    error(`Failed to read Cargo.toml: ${err.message}`);
    return null;
  }
}

function checkVersions() {
  log('Checking version consistency...', 'blue');
  
  const versions = {};
  
  // Check package.json
  const packageJson = readJsonFile('./package.json');
  if (packageJson) {
    versions['package.json'] = packageJson.version;
  }
  
  // Check Cargo.toml
  const cargoVersion = readCargoToml();
  if (cargoVersion) {
    versions['Cargo.toml'] = cargoVersion;
  }
  
  // Check VERSION file
  try {
    const versionFile = fs.readFileSync('./VERSION', 'utf8').trim();
    versions['VERSION'] = versionFile;
  } catch (err) {
    warning('VERSION file not found');
  }
  
  // Display all versions
  log('\nCurrent versions:', 'blue');
  for (const [file, version] of Object.entries(versions)) {
    log(`  ${file}: ${version}`, 'cyan');
  }
  
  // Check consistency
  const uniqueVersions = [...new Set(Object.values(versions))];
  
  if (uniqueVersions.length === 0) {
    error('No versions found');
    process.exit(1);
  }
  
  if (uniqueVersions.length === 1) {
    success(`All version files are consistent: ${uniqueVersions[0]}`);
  } else {
    error('Version mismatch detected!');
    log('\nInconsistent versions:', 'red');
    for (const [file, version] of Object.entries(versions)) {
      log(`  ${file}: ${version}`, 'red');
    }
    process.exit(1);
  }
  
  // Check if version follows semver
  const mainVersion = uniqueVersions[0];
  const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
  
  if (semverRegex.test(mainVersion)) {
    success('Version follows semantic versioning');
  } else {
    warning('Version does not follow semantic versioning format');
  }
  
  log('\nVersion check completed successfully!', 'green');
}

// Run the check
checkVersions(); 