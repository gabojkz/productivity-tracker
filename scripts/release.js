#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import semver from 'semver';

const RELEASE_TYPE = process.argv[2];

if (!RELEASE_TYPE || !['patch', 'minor', 'major', 'preview'].includes(RELEASE_TYPE)) {
  console.error('Usage: node scripts/release.js <patch|minor|major|preview>');
  process.exit(1);
}

// Configuration
const CONFIG = {
  packageJsonPath: './package.json',
  cargoTomlPath: './src-tauri/Cargo.toml',
  changelogPath: './CHANGELOG.md',
  releaseNotesPath: './RELEASE_NOTES.md',
  versionFile: './VERSION'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
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

function info(message) {
  console.log(`${colors.blue}ℹ ${message}${colors.reset}`);
}

// Utility functions
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    error(`Failed to read ${filePath}: ${err.message}`);
    process.exit(1);
  }
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  } catch (err) {
    error(`Failed to write ${filePath}: ${err.message}`);
    process.exit(1);
  }
}

function readCargoToml() {
  try {
    const content = fs.readFileSync(CONFIG.cargoTomlPath, 'utf8');
    const lines = content.split('\n');
    const packageSection = {};
    
    let inPackageSection = false;
    for (const line of lines) {
      if (line.trim() === '[package]') {
        inPackageSection = true;
        continue;
      }
      if (inPackageSection && line.trim().startsWith('[')) {
        break;
      }
      if (inPackageSection && line.includes('=')) {
        const [key, value] = line.split('=').map(s => s.trim());
        packageSection[key] = value.replace(/"/g, '');
      }
    }
    
    return packageSection;
  } catch (err) {
    error(`Failed to read ${CONFIG.cargoTomlPath}: ${err.message}`);
    process.exit(1);
  }
}

function writeCargoToml(version) {
  try {
    let content = fs.readFileSync(CONFIG.cargoTomlPath, 'utf8');
    content = content.replace(/version = "([^"]+)"/, `version = "${version}"`);
    fs.writeFileSync(CONFIG.cargoTomlPath, content);
  } catch (err) {
    error(`Failed to write ${CONFIG.cargoTomlPath}: ${err.message}`);
    process.exit(1);
  }
}

function getCurrentVersion() {
  const packageJson = readJsonFile(CONFIG.packageJsonPath);
  return packageJson.version;
}

function bumpVersion(currentVersion, releaseType) {
  if (releaseType === 'preview') {
    const prerelease = semver.prerelease(currentVersion);
    if (prerelease) {
      const [type, number] = prerelease;
      return semver.inc(currentVersion, 'prerelease', type);
    } else {
      return semver.inc(currentVersion, 'prepatch');
    }
  }
  return semver.inc(currentVersion, releaseType);
}

function updateVersions(newVersion) {
  log('Updating version numbers...', 'blue');
  
  // Update package.json
  const packageJson = readJsonFile(CONFIG.packageJsonPath);
  packageJson.version = newVersion;
  writeJsonFile(CONFIG.packageJsonPath, packageJson);
  success(`Updated package.json to version ${newVersion}`);
  
  // Update Cargo.toml
  writeCargoToml(newVersion);
  success(`Updated Cargo.toml to version ${newVersion}`);
  
  // Write version to VERSION file
  fs.writeFileSync(CONFIG.versionFile, newVersion + '\n');
  success(`Updated VERSION file to ${newVersion}`);
}

function generateChangelog(newVersion) {
  log('Generating changelog...', 'blue');
  
  try {
    // Get git log since last tag
    const lastTag = execSync('git describe --tags --abbrev=0 2>/dev/null || echo ""', { encoding: 'utf8' }).trim();
    const gitLog = lastTag 
      ? execSync(`git log ${lastTag}..HEAD --oneline --no-merges`, { encoding: 'utf8' })
      : execSync('git log --oneline --no-merges', { encoding: 'utf8' });
    
    const commits = gitLog.trim().split('\n').filter(line => line.trim());
    
    if (commits.length === 0) {
      warning('No new commits found since last release');
      return;
    }
    
    // Categorize commits
    const categories = {
      'feat': '✨ Features',
      'fix': '🐛 Bug Fixes',
      'docs': '📚 Documentation',
      'style': '💄 Styles',
      'refactor': '♻️ Refactoring',
      'perf': '⚡ Performance',
      'test': '🧪 Tests',
      'chore': '🔧 Chores',
      'ci': '👷 CI/CD',
      'build': '📦 Build',
      'revert': '⏪ Reverts'
    };
    
    const categorized = {};
    
    for (const commit of commits) {
      const match = commit.match(/^[a-f0-9]+ (.+)$/);
      if (match) {
        const message = match[1];
        let category = 'other';
        
        // Check for conventional commit format
        for (const [prefix, cat] of Object.entries(categories)) {
          if (message.toLowerCase().startsWith(prefix + ':')) {
            category = cat;
            break;
          }
        }
        
        if (!categorized[category]) {
          categorized[category] = [];
        }
        categorized[category].push(message);
      }
    }
    
    // Generate changelog content
    let changelog = `# Changelog\n\n`;
    changelog += `## [${newVersion}] - ${new Date().toISOString().split('T')[0]}\n\n`;
    
    for (const [category, messages] of Object.entries(categorized)) {
      if (messages.length > 0) {
        changelog += `### ${category}\n\n`;
        for (const message of messages) {
          changelog += `- ${message}\n`;
        }
        changelog += '\n';
      }
    }
    
    // Read existing changelog
    let existingChangelog = '';
    try {
      existingChangelog = fs.readFileSync(CONFIG.changelogPath, 'utf8');
    } catch (err) {
      // File doesn't exist, that's okay
    }
    
    // Prepend new changelog
    const fullChangelog = changelog + existingChangelog;
    fs.writeFileSync(CONFIG.changelogPath, fullChangelog);
    
    success(`Generated changelog for version ${newVersion}`);
  } catch (err) {
    error(`Failed to generate changelog: ${err.message}`);
  }
}

function createReleaseNotes(newVersion) {
  log('Creating release notes...', 'blue');
  
  try {
    const changelog = fs.readFileSync(CONFIG.changelogPath, 'utf8');
    const versionSection = changelog.split('## [')[1]?.split('## [')[0];
    
    if (versionSection) {
      const releaseNotes = `# Release Notes - ${newVersion}\n\n${versionSection}`;
      fs.writeFileSync(CONFIG.releaseNotesPath, releaseNotes);
      success(`Created release notes for version ${newVersion}`);
    }
  } catch (err) {
    warning(`Could not create release notes: ${err.message}`);
  }
}

function checkGitStatus() {
  log('Checking git status...', 'blue');
  
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      error('Working directory is not clean. Please commit or stash your changes.');
      console.log('\nUncommitted changes:');
      console.log(status);
      process.exit(1);
    }
    success('Git working directory is clean');
  } catch (err) {
    error(`Failed to check git status: ${err.message}`);
    process.exit(1);
  }
}

function createGitTag(version) {
  log('Creating git tag...', 'blue');
  
  try {
    execSync(`git add .`);
    execSync(`git commit -m "chore: bump version to ${version}"`);
    execSync(`git tag -a v${version} -m "Release version ${version}"`);
    success(`Created git tag v${version}`);
  } catch (err) {
    error(`Failed to create git tag: ${err.message}`);
    process.exit(1);
  }
}

function buildApplication() {
  log('Building application...', 'blue');
  
  try {
    execSync('npm run build:all', { stdio: 'inherit' });
    success('Application built successfully');
  } catch (err) {
    error('Build failed');
    process.exit(1);
  }
}

function main() {
  log(`🚀 Starting release process for type: ${RELEASE_TYPE}`, 'bright');
  
  // Check git status
  checkGitStatus();
  
  // Get current version
  const currentVersion = getCurrentVersion();
  log(`Current version: ${currentVersion}`, 'cyan');
  
  // Calculate new version
  const newVersion = bumpVersion(currentVersion, RELEASE_TYPE);
  log(`New version: ${newVersion}`, 'cyan');
  
  // Update versions in all files
  updateVersions(newVersion);
  
  // Generate changelog
  generateChangelog(newVersion);
  
  // Create release notes
  createReleaseNotes(newVersion);
  
  // Create git tag
  createGitTag(newVersion);
  
  // Build application
  buildApplication();
  
  log('\n🎉 Release completed successfully!', 'green');
  log(`\nNext steps:`, 'bright');
  log(`1. Review the changes: git log --oneline -10`);
  log(`2. Push the tag: git push origin v${newVersion}`);
  log(`3. Push the changes: git push origin main`);
  log(`4. Create a GitHub release with the generated changelog`);
  log(`5. Distribute the built application from src-tauri/target/release/`);
  
  if (RELEASE_TYPE === 'preview') {
    log(`\n⚠️  This is a preview release. Consider creating a proper release later.`, 'yellow');
  }
}

// Run the release process
main(); 