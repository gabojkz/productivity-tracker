# Automated Release System Setup

## Overview
Your app now has a complete automated release system! This guide will help you set it up.

## 🚀 Quick Start

### 1. Install GitHub CLI
```bash
# macOS
brew install gh

# Ubuntu/Debian
sudo apt install gh

# Windows
winget install GitHub.cli
```

### 2. Authenticate with GitHub
```bash
gh auth login
```

### 3. Set up GitHub Token
```bash
# Create a GitHub token with repo permissions
export GITHUB_TOKEN=your_github_token_here
```

### 4. Update Configuration
Edit `scripts/release.js` and replace:
```javascript
const CONFIG = {
  repo: 'YOUR_USERNAME/YOUR_REPO', // ← Replace with your repo
  githubToken: process.env.GITHUB_TOKEN,
  platforms: ['darwin-x86_64', 'darwin-aarch64', 'linux-x86_64', 'windows-x86_64']
};
```

## 📦 Release Commands

### Manual Release (Local)
```bash
# Patch release (0.1.0 → 0.1.1)
npm run release:patch

# Minor release (0.1.0 → 0.2.0)
npm run release:minor

# Major release (0.1.0 → 1.0.0)
npm run release:major

# Build only (no GitHub release)
npm run release:build
```

### Automated Release (GitHub Actions)
1. **Push a tag** to trigger automated release:
   ```bash
   git tag v0.1.1
   git push origin v0.1.1
   ```

2. **GitHub Actions will automatically:**
   - Build for all platforms (macOS, Linux, Windows)
   - Create GitHub release
   - Upload all artifacts
   - Make update available to users

## 🔄 Complete Workflow

### Option A: Manual Release
```bash
# 1. Make your changes
git add .
git commit -m "Add new feature"

# 2. Release
npm run release:patch

# 3. Done! Users can now update automatically
```

### Option B: Automated Release
```bash
# 1. Make your changes
git add .
git commit -m "Add new feature"
git push origin main

# 2. Create and push tag
git tag v0.1.1
git push origin v0.1.1

# 3. GitHub Actions handles everything automatically
```

## 🎯 What Happens Automatically

### Local Release Script:
1. ✅ Updates version in `package.json` and `Cargo.toml`
2. ✅ Builds the app for all platforms
3. ✅ Commits and pushes changes
4. ✅ Creates GitHub release with assets
5. ✅ Users can now update automatically

### GitHub Actions:
1. ✅ Triggers on tag push
2. ✅ Builds for all platforms in parallel
3. ✅ Creates GitHub release
4. ✅ Uploads all artifacts
5. ✅ Notifies completion

## 📱 User Experience

Users will see:
1. **Settings Page**: "Check for Updates" button
2. **Update Available**: Shows new version info
3. **One Click**: Download and install automatically
4. **Automatic Restart**: App restarts with new version

## 🔧 Configuration

### Update Endpoint
Edit `src-tauri/tauri.conf.json`:
```json
{
  "plugins": {
    "updater": {
      "enabled": true,
      "endpoints": [
        "https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/releases/latest"
      ],
      "dialog": true,
      "pubkey": "YOUR_PUBLIC_KEY_HERE"
    }
  }
}
```

### Signing Keys (Production)
```bash
# Generate keys
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem

# Add public key to tauri.conf.json
```

## 🚨 Troubleshooting

### Common Issues:

1. **GitHub CLI not installed**
   ```bash
   brew install gh && gh auth login
   ```

2. **No GITHUB_TOKEN**
   ```bash
   export GITHUB_TOKEN=your_token_here
   ```

3. **Build fails**
   ```bash
   npm run clean && npm install && npm run tauri build
   ```

4. **Release not created**
   - Check GitHub Actions tab
   - Verify tag was pushed correctly
   - Check repository permissions

## 🎉 Benefits

- **Zero Manual Work**: Just run one command
- **Cross-Platform**: Builds for all platforms automatically
- **User-Friendly**: One-click updates for users
- **Secure**: Code signing and verification
- **Reliable**: GitHub Actions handles everything

## 📈 Next Steps

1. Set up your GitHub repository
2. Configure the release script
3. Test with a small version bump
4. Deploy your first automated release!

Your app now has enterprise-grade release automation! 🚀 