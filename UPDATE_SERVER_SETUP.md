# Auto-Update Server Setup Guide

## Overview
Your Tauri app now supports automatic updates! This guide will help you set up the update server and configure the auto-update system.

## Prerequisites

1. **Update Server**: You need a web server to host your app updates
2. **Code Signing**: For production apps, you need to sign your releases
3. **Update Endpoint**: A JSON endpoint that provides update information

## Step 1: Configure Update Server

### Option A: GitHub Releases (Recommended)
1. Create a GitHub repository for your app
2. Upload your signed releases to GitHub Releases
3. Use the following endpoint format:
   ```
   https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/releases/latest
   ```

### Option B: Custom Server
Create a JSON endpoint that returns update information:
```json
{
  "version": "0.1.1",
  "notes": "Bug fixes and improvements",
  "pub_date": "2024-01-15T12:00:00Z",
  "platforms": {
    "darwin-x86_64": {
      "signature": "YOUR_SIGNATURE",
      "url": "https://your-server.com/downloads/app-v0.1.1.dmg"
    },
    "darwin-aarch64": {
      "signature": "YOUR_SIGNATURE", 
      "url": "https://your-server.com/downloads/app-v0.1.1-arm64.dmg"
    },
    "linux-x86_64": {
      "signature": "YOUR_SIGNATURE",
      "url": "https://your-server.com/downloads/app-v0.1.1.AppImage"
    },
    "windows-x86_64": {
      "signature": "YOUR_SIGNATURE",
      "url": "https://your-server.com/downloads/app-v0.1.1.msi"
    }
  }
}
```

## Step 2: Update Configuration

Update your `src-tauri/tauri.conf.json`:

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

## Step 3: Generate Keys

1. **Generate Key Pair**:
   ```bash
   openssl genrsa -out private.pem 2048
   openssl rsa -in private.pem -pubout -out public.pem
   ```

2. **Add Public Key**:
   - Copy the content of `public.pem` to the `pubkey` field in `tauri.conf.json`

## Step 4: Sign Your Releases

### For Development:
```bash
npm run tauri build
```

### For Production:
```bash
npm run tauri build -- --release
```

## Step 5: Upload Updates

1. **Build your app** with the new version
2. **Sign the release** with your private key
3. **Upload to your server** or GitHub Releases
4. **Update the version** in `package.json` and `src-tauri/Cargo.toml`

## Testing Auto-Updates

1. **Build and install** version 0.1.0
2. **Update version** to 0.1.1 in your config files
3. **Build new release** and upload to server
4. **Run the app** and check for updates in Settings

## Security Notes

- **Never commit** your private key
- **Use HTTPS** for all update endpoints
- **Verify signatures** on the client side
- **Test thoroughly** before production release

## Troubleshooting

### Common Issues:
1. **Update not found**: Check your endpoint URL and JSON format
2. **Signature verification failed**: Ensure your public key matches the signature
3. **Download failed**: Check file URLs and server accessibility

### Debug Mode:
Add this to your `tauri.conf.json` for debugging:
```json
{
  "plugins": {
    "updater": {
      "enabled": true,
      "endpoints": ["YOUR_ENDPOINT"],
      "dialog": true,
      "pubkey": "YOUR_PUBLIC_KEY",
      "debug": true
    }
  }
}
```

## Next Steps

1. Set up your update server
2. Generate and configure your keys
3. Test the update system
4. Deploy your first auto-update!

For more information, see the [Tauri Updater Documentation](https://tauri.app/v2/guides/distribution/updater/). 