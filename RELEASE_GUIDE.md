# Release Automation Guide

This guide explains how to use the automated release system for the Productivity Tracker app.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Git repository initialized
- All changes committed

### Making a Release

1. **Patch Release** (bug fixes):
   ```bash
   npm run release:patch
   ```

2. **Minor Release** (new features):
   ```bash
   npm run release:minor
   ```

3. **Major Release** (breaking changes):
   ```bash
   npm run release:major
   ```

4. **Preview Release** (for testing):
   ```bash
   npm run release:preview
   ```

## 📋 What the Release Process Does

### 1. Version Management
- Updates version in `package.json`
- Updates version in `src-tauri/Cargo.toml`
- Creates/updates `VERSION` file
- Ensures all version numbers are consistent

### 2. Changelog Generation
- Analyzes git commits since last release
- Categorizes commits by type (feat, fix, docs, etc.)
- Generates formatted changelog in `CHANGELOG.md`
- Creates release notes in `RELEASE_NOTES.md`

### 3. Git Operations
- Checks for uncommitted changes
- Commits version bump
- Creates git tag with release message

### 4. Build Process
- Builds the Vue.js frontend
- Builds the Tauri application
- Creates distributable binaries

## 📝 Commit Message Convention

For proper changelog generation, use conventional commit messages:

```
type(scope): description

Examples:
feat(calendar): add event categories
fix(momento-mori): resolve display issues
docs(readme): update installation instructions
style(ui): improve button styling
refactor(components): extract modal logic
perf(analytics): optimize chart rendering
test(calendar): add unit tests
chore(deps): update dependencies
```

### Commit Types
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `build`: Build system changes
- `revert`: Reverting previous commits

## 🔧 Manual Commands

### Check Version Consistency
```bash
npm run version:check
```

### Generate Changelog Only
```bash
npm run changelog
```

### Build Application
```bash
npm run build:all
```

## 🏷️ Git Tags

The release process creates git tags automatically:
- Format: `v1.2.3`
- Message: "Release version 1.2.3"

### Push Tags
```bash
git push origin v1.2.3
```

### List Tags
```bash
git tag --sort=-version:refname
```

## 🌐 GitHub Releases

When you push a tag, GitHub Actions will:
1. Build the application for all platforms (macOS, Linux, Windows)
2. Create a GitHub release with the tag
3. Upload the built binaries as release assets
4. Include the generated changelog in the release notes

## 📦 Release Assets

The automated build creates:
- `productivity-tracker` (macOS)
- `productivity-tracker` (Linux)
- `productivity-tracker.exe` (Windows)
- `CHANGELOG.md`
- `RELEASE_NOTES.md`

## 🔄 Workflow

### Typical Release Process

1. **Develop Features**
   ```bash
   git checkout -b feature/new-calendar-view
   # Make changes
   git commit -m "feat(calendar): add full year view"
   git push origin feature/new-calendar-view
   ```

2. **Merge to Main**
   ```bash
   git checkout main
   git merge feature/new-calendar-view
   git push origin main
   ```

3. **Create Release**
   ```bash
   npm run release:minor
   ```

4. **Push Tag**
   ```bash
   git push origin v1.2.0
   ```

5. **GitHub Actions**
   - Automatically builds for all platforms
   - Creates GitHub release
   - Uploads binaries

## 🛠️ Troubleshooting

### Common Issues

**"Working directory is not clean"**
```bash
git add .
git commit -m "chore: prepare for release"
npm run release:patch
```

**"Version mismatch detected"**
```bash
npm run version:check
# Manually fix version numbers if needed
```

**"Build failed"**
```bash
npm run build:all
# Check for build errors
```

### Manual Version Bump

If you need to manually update versions:

1. **package.json**:
   ```json
   {
     "version": "1.2.3"
   }
   ```

2. **src-tauri/Cargo.toml**:
   ```toml
   [package]
   version = "1.2.3"
   ```

3. **VERSION file**:
   ```
   1.2.3
   ```

## 📊 Release History

Check the release history:
- GitHub Releases page
- `CHANGELOG.md` file
- Git tags: `git tag --sort=-version:refname`

## 🎯 Best Practices

1. **Use Conventional Commits**: Makes changelog generation accurate
2. **Test Before Release**: Ensure everything works locally
3. **Review Changes**: Check the generated changelog
4. **Communicate**: Let users know about new releases
5. **Document**: Update documentation for new features

## 🔗 Related Files

- `scripts/release.js` - Main release script
- `scripts/generate-changelog.js` - Changelog generator
- `scripts/check-versions.js` - Version consistency checker
- `.github/workflows/release.yml` - GitHub Actions workflow
- `CHANGELOG.md` - Generated changelog
- `RELEASE_NOTES.md` - Release notes
- `VERSION` - Current version file 