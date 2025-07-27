#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Get version from package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;

// Read current README
const readmePath = 'README.md';
let readmeContent = fs.readFileSync(readmePath, 'utf8');

// Define the download section template with dynamic version
const downloadSection = `## 📥 Download

Get the latest version for your platform:

### 🪟 Windows
- **Installer**: [productivity-tracker_${version}_x64_en-US.msi](https://github.com/gabojkz/productivity-tracker/releases/latest/download/productivity-tracker_${version}_x64_en-US.msi)
- **Portable**: [productivity-tracker_${version}_x64_en-US.exe](https://github.com/gabojkz/productivity-tracker/releases/latest/download/productivity-tracker_${version}_x64_en-US.exe)

### 🍎 macOS
- **Apple Silicon (M1/M2)**: [productivity-tracker_${version}_aarch64.dmg](https://github.com/gabojkz/productivity-tracker/releases/latest/download/productivity-tracker_${version}_aarch64.dmg)
- **Intel**: [productivity-tracker_${version}_x64.dmg](https://github.com/gabojkz/productivity-tracker/releases/latest/download/productivity-tracker_${version}_x64.dmg)

### 🐧 Linux
- **AppImage**: [productivity-tracker_${version}_x86_64.AppImage](https://github.com/gabojkz/productivity-tracker/releases/latest/download/productivity-tracker_${version}_x86_64.AppImage)
- **Debian/Ubuntu**: [productivity-tracker_${version}_amd64.deb](https://github.com/gabojkz/productivity-tracker/releases/latest/download/productivity-tracker_${version}_amd64.deb)

### 🔄 Auto-Updates
The app supports automatic updates. When a new version is available, you'll be notified and can update directly from the app.

---

`;

// Replace the download section in README
const downloadSectionRegex = /## 📥 Download[\s\S]*?---\s*\n/;
readmeContent = readmeContent.replace(downloadSectionRegex, downloadSection);

// Write updated README
fs.writeFileSync(readmePath, readmeContent);

console.log(`✅ Updated README download links to version ${version}`); 