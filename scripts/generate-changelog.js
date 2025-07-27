#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';

const CHANGELOG_PATH = './CHANGELOG.md';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function generateChangelog() {
  log('Generating changelog...', 'blue');
  
  try {
    // Get all tags
    const tags = execSync('git tag --sort=-version:refname', { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(tag => tag.trim());
    
    if (tags.length === 0) {
      log('No git tags found. Creating initial changelog...', 'yellow');
      createInitialChangelog();
      return;
    }
    
    // Get commits since the last tag
    const lastTag = tags[0];
    const gitLog = execSync(`git log ${lastTag}..HEAD --oneline --no-merges`, { encoding: 'utf8' });
    const commits = gitLog.trim().split('\n').filter(line => line.trim());
    
    if (commits.length === 0) {
      log('No new commits found since last release', 'yellow');
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
    changelog += `## [Unreleased] - ${new Date().toISOString().split('T')[0]}\n\n`;
    
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
      existingChangelog = fs.readFileSync(CHANGELOG_PATH, 'utf8');
    } catch (err) {
      // File doesn't exist, that's okay
    }
    
    // Prepend new changelog
    const fullChangelog = changelog + existingChangelog;
    fs.writeFileSync(CHANGELOG_PATH, fullChangelog);
    
    log('✓ Changelog generated successfully', 'green');
    log(`Found ${commits.length} commits since last release`, 'blue');
    
  } catch (err) {
    log(`Failed to generate changelog: ${err.message}`, 'red');
    process.exit(1);
  }
}

function createInitialChangelog() {
  const changelog = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### ✨ Features
- Initial release

### 🔧 Chores
- Project setup
- Basic functionality implementation
`;

  fs.writeFileSync(CHANGELOG_PATH, changelog);
  log('✓ Initial changelog created', 'green');
}

// Run the script
generateChangelog(); 