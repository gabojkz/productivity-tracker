# GitHub Release Setup Guide

## Fixing 403 Errors in GitHub Actions

If you're getting 403 errors when creating GitHub releases, follow these steps:

### 1. Create a Personal Access Token (PAT)

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Productivity Tracker Releases"
4. Select these scopes:
   - `repo` (Full control of private repositories)
   - `write:packages` (Upload packages to GitHub Package Registry)
   - `read:packages` (Download packages from GitHub Package Registry)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

### 2. Add the Token to Repository Secrets

1. Go to your repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `PAT_TOKEN`
4. Value: Paste your Personal Access Token
5. Click "Add secret"

### 3. Update the Workflow (if needed)

If you're still getting 403 errors, update the workflow to use the PAT:

```yaml
env:
  GITHUB_TOKEN: ${{ secrets.PAT_TOKEN }}
```

### 4. Alternative: Use GITHUB_TOKEN with Proper Permissions

If you prefer to use the default `GITHUB_TOKEN`, ensure it has the right permissions:

1. Go to your repository → Settings → Actions → General
2. Scroll down to "Workflow permissions"
3. Select "Read and write permissions"
4. Check "Allow GitHub Actions to create and approve pull requests"
5. Save

### 5. Test the Release

1. Create a new tag:
   ```bash
   git tag v0.5.4
   git push origin v0.5.4
   ```

2. Monitor the GitHub Actions workflow
3. Check the "create-release" job logs for any errors

## Troubleshooting

### Common Issues:

1. **403 Forbidden**: Token doesn't have enough permissions
2. **No artifacts found**: Build didn't complete successfully
3. **Pattern doesn't match**: Artifact paths are incorrect

### Debug Steps:

1. Check the "List build outputs" step in the workflow
2. Check the "List downloaded artifacts" step
3. Verify the artifact upload/download paths
4. Ensure the repository has the right permissions

## File Structure

The workflow expects these files to be created:
- `src-tauri/target/release/bundle/` - Contains platform-specific builds
- `*.dmg` (macOS)
- `*.AppImage` (Linux)
- `*.msi` or `*.exe` (Windows)

Make sure your Tauri build is configured to create these files. 