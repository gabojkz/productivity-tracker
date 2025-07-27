#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  repo: 'YOUR_USERNAME/YOUR_REPO', // Replace with your GitHub repo
  githubToken: process.env.GITHUB_TOKEN, // Set this in your environment
  platforms: ['darwin-x86_64', 'darwin-aarch64', 'linux-x86_64', 'windows-x86_64']
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    return execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    log(`Error executing: ${command}`, 'red');
    process.exit(1);
  }
}

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

function updateVersion(type = 'patch') {
  log('📦 Updating version...', 'blue');
  
  // Read current versions
  const packageJson = readJsonFile('package.json');
  const cargoToml = fs.readFileSync('src-tauri/Cargo.toml', 'utf8');
  
  // Parse current version
  const currentVersion = packageJson.version;
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  
  // Calculate new version
  let newVersion;
  switch (type) {
    case 'major':
      newVersion = `${major + 1}.0.0`;
      break;
    case 'minor':
      newVersion = `${major}.${minor + 1}.0`;
      break;
    case 'patch':
    default:
      newVersion = `${major}.${minor}.${patch + 1}`;
      break;
  }
  
  log(`Updating from ${currentVersion} to ${newVersion}`, 'yellow');
  
  // Update package.json
  packageJson.version = newVersion;
  writeJsonFile('package.json', packageJson);
  
  // Update Cargo.toml
  const cargoContent = cargoToml.replace(
    /version = "[\d.]+"/,
    `version = "${newVersion}"`
  );
  fs.writeFileSync('src-tauri/Cargo.toml', cargoContent);
  
  // Update VERSION file
  fs.writeFileSync('VERSION', newVersion);
  
  return newVersion;
}

function buildApp() {
  log('🔨 Building app...', 'blue');
  
  // Clean previous builds
  exec('npm run clean || true');
  
  // Install dependencies
  exec('npm install');
  
  // Build the app
  exec('npm run tauri build');
  
  log('✅ Build completed successfully!', 'green');
}

function createGitHubRelease(version, releaseNotes) {
  log('🚀 Creating GitHub release...', 'blue');
  
  if (!CONFIG.githubToken) {
    log('❌ GITHUB_TOKEN environment variable not set', 'red');
    log('Please set GITHUB_TOKEN=your_token_here', 'yellow');
    return;
  }
  
  // Create release notes file
  const releaseNotesFile = 'RELEASE_NOTES.md';
  fs.writeFileSync(releaseNotesFile, releaseNotes);
  
  // Get built files
  const buildDir = 'src-tauri/target/release';
  const files = fs.readdirSync(buildDir).filter(file => 
    file.endsWith('.dmg') || file.endsWith('.AppImage') || file.endsWith('.msi') || file.endsWith('.exe')
  );
  
  if (files.length === 0) {
    log('❌ No built files found in target/release', 'red');
    return;
  }
  
  // Create GitHub release using gh CLI
  try {
    // Create release
    exec(`gh release create v${version} --title "v${version}" --notes-file ${releaseNotesFile} --draft`);
    
    // Upload assets
    files.forEach(file => {
      const filePath = path.join(buildDir, file);
      log(`📤 Uploading ${file}...`, 'yellow');
      exec(`gh release upload v${version} "${filePath}"`);
    });
    
    // Publish release
    exec(`gh release edit v${version} --draft=false`);
    
    log('✅ GitHub release created successfully!', 'green');
    
    // Clean up
    fs.unlinkSync(releaseNotesFile);
    
  } catch (error) {
    log('❌ Failed to create GitHub release', 'red');
    log('Make sure you have GitHub CLI installed and authenticated', 'yellow');
    log('Install with: brew install gh && gh auth login', 'yellow');
  }
}

function generateReleaseNotes(version, type) {
  const date = new Date().toISOString().split('T')[0];
  
  return `# Release v${version}

## What's New
- Bug fixes and improvements
- Enhanced user experience
- Performance optimizations

## Changes
- Automated release process
- Auto-update functionality
- Improved stability

## Installation
Download the latest version for your platform from the assets below.

---
*Released on ${date}*
`;
}

function commitAndPush(version) {
  log('📝 Committing changes...', 'blue');
  
  exec('git add .');
  exec(`git commit -m "Release v${version}"`);
  exec('git push origin main');
  
  log('✅ Changes pushed to GitHub!', 'green');
}

function main() {
  const args = process.argv.slice(2);
  const type = args[0] || 'patch';
  const skipBuild = args.includes('--skip-build');
  const skipRelease = args.includes('--skip-release');
  
  log('🚀 Starting automated release process...', 'green');
  
  try {
    // Update version
    const newVersion = updateVersion(type);
    
    // Build app (unless skipped)
    if (!skipBuild) {
      buildApp();
    }
    
    // Commit and push changes
    commitAndPush(newVersion);
    
    // Create GitHub release (unless skipped)
    if (!skipRelease) {
      const releaseNotes = generateReleaseNotes(newVersion, type);
      createGitHubRelease(newVersion, releaseNotes);
    }
    
    log('🎉 Release process completed successfully!', 'green');
    log(`📱 Users can now update to v${newVersion}`, 'blue');
    
  } catch (error) {
    log('❌ Release process failed!', 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { updateVersion, buildApp, createGitHubRelease }; 