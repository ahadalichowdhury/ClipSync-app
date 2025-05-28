# 🚀 Release Guide

This guide explains how to create releases for ClipSync with both ARM64 and Intel DMG files for macOS.

## 📋 Release Types

ClipSync supports building for multiple platforms and architectures:

### macOS

- **Intel DMG** (`ClipSync-1.0.0-mac-x64.dmg`) - For Intel-based Macs
- **ARM64 DMG** (`ClipSync-1.0.0-mac-arm64.dmg`) - For Apple Silicon Macs (M1, M2, M3)
- **Universal DMG** (`ClipSync-1.0.0-mac-universal.dmg`) - Contains both architectures
- **ZIP files** - Alternative distribution format

### Windows

- **NSIS Installer** (`ClipSync-Setup-1.0.0.exe`) - Standard Windows installer
- **Portable** (`ClipSync-1.0.0-portable.exe`) - Portable executable

### Linux

- **AppImage** (`ClipSync-1.0.0.AppImage`) - Universal Linux package
- **DEB** (`ClipSync-1.0.0.deb`) - Debian/Ubuntu package
- **RPM** (`ClipSync-1.0.0.rpm`) - Red Hat/Fedora package

## 🤖 Automated Release (Recommended)

### Using GitHub Actions

1. **Push a tag** to trigger automatic release:

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Manual trigger** via GitHub Actions:
   - Go to your repository on GitHub
   - Click "Actions" tab
   - Select "Release" workflow
   - Click "Run workflow"
   - Enter version (e.g., `v1.0.0`)
   - Click "Run workflow"

The automated workflow will:

- ✅ Build for all platforms (macOS, Windows, Linux)
- ✅ Create both ARM64 and Intel DMG files
- ✅ Upload all artifacts to GitHub Releases
- ✅ Generate release notes automatically

## 🛠️ Manual Release

### Prerequisites

- **macOS**: Required for building DMG files
- **Node.js** ≥ 18.0.0
- **npm** ≥ 8.0.0
- **Xcode Command Line Tools** (macOS)

### Method 1: Using the Build Script

```bash
# Run the automated build script
./scripts/build-release.sh
```

This script will:

- Clean previous builds
- Install dependencies
- Build the application
- Create Intel and ARM64 DMG files
- Optionally build for other platforms

### Method 2: Manual Commands

```bash
# Install dependencies
npm ci

# Build the application
npm run build

# Build macOS DMG for Intel
npm run dist:mac:x64

# Build macOS DMG for ARM64
npm run dist:mac:arm64

# Build Universal DMG (optional)
npm run dist:mac:universal

# Build for Windows (if needed)
npm run dist:win

# Build for Linux (if needed)
npm run dist:linux
```

## 📦 Release Files

After building, you'll find the following files in the `release/` directory:

```
release/
├── 1.0.0/
│   ├── ClipSync-1.0.0-mac-x64.dmg          # Intel DMG
│   ├── ClipSync-1.0.0-mac-arm64.dmg        # ARM64 DMG
│   ├── ClipSync-1.0.0-mac-universal.dmg    # Universal DMG
│   ├── ClipSync-1.0.0-mac-x64.zip          # Intel ZIP
│   ├── ClipSync-1.0.0-mac-arm64.zip        # ARM64 ZIP
│   ├── ClipSync-Setup-1.0.0.exe            # Windows Installer
│   ├── ClipSync-1.0.0-portable.exe         # Windows Portable
│   ├── ClipSync-1.0.0.AppImage             # Linux AppImage
│   ├── ClipSync-1.0.0.deb                  # Linux DEB
│   └── ClipSync-1.0.0.rpm                  # Linux RPM
```

## 🔐 Code Signing (macOS)

For distribution outside the Mac App Store, you'll need:

1. **Apple Developer Account**
2. **Developer ID Application Certificate**
3. **App-specific password** for notarization

### Setup Code Signing

```bash
# Set environment variables
export APPLE_ID="your-apple-id@example.com"
export APPLE_ID_PASSWORD="app-specific-password"
export APPLE_TEAM_ID="your-team-id"

# Build with code signing
npm run dist:mac:x64
npm run dist:mac:arm64
```

### Notarization

The build process will automatically notarize your app if you have the required credentials set up.

## 📤 Publishing to GitHub

### Automatic (via GitHub Actions)

The GitHub Actions workflow automatically publishes releases when triggered.

### Manual Upload

1. **Create a new release** on GitHub:

   - Go to your repository
   - Click "Releases" → "Create a new release"
   - Choose a tag (e.g., `v1.0.0`)
   - Add release title and description

2. **Upload files**:
   - Drag and drop all files from `release/1.0.0/`
   - Or use GitHub CLI:
     ```bash
     gh release create v1.0.0 release/1.0.0/* --title "ClipSync v1.0.0" --notes "Release notes here"
     ```

## 🧪 Testing Releases

### Before Publishing

1. **Test on different architectures**:

   - Intel Mac: Test the x64 DMG
   - Apple Silicon Mac: Test the ARM64 DMG
   - Windows: Test both installer and portable
   - Linux: Test AppImage and package formats

2. **Verify functionality**:
   - App launches correctly
   - Clipboard monitoring works
   - Global hotkeys function
   - Settings persist
   - Auto-updater works (if implemented)

### After Publishing

1. **Download from GitHub Releases**
2. **Test installation process**
3. **Verify app signature** (macOS):
   ```bash
   codesign -dv --verbose=4 /Applications/ClipSync.app
   spctl -a -v /Applications/ClipSync.app
   ```

## 🔄 Version Management

### Semantic Versioning

ClipSync follows [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (1.1.0): New features, backward compatible
- **PATCH** (1.0.1): Bug fixes, backward compatible

### Updating Version

1. **Update package.json**:

   ```bash
   npm version patch  # or minor, major
   ```

2. **Update version in code** (if needed)

3. **Create and push tag**:
   ```bash
   git push origin main --tags
   ```

## 🚨 Troubleshooting

### Common Issues

1. **DMG build fails**:

   - Ensure you're on macOS
   - Check Xcode Command Line Tools are installed
   - Verify disk space availability

2. **Code signing fails**:

   - Check Apple Developer certificates
   - Verify environment variables
   - Ensure keychain access

3. **Large file sizes**:
   - Check if debug symbols are included
   - Verify dependencies are production-only
   - Consider using asar packaging

### Build Logs

Check build logs in:

- Local: Terminal output
- GitHub Actions: Actions tab → Workflow run → Job logs

## 📞 Support

If you encounter issues with the release process:

1. Check the [troubleshooting section](#-troubleshooting)
2. Review [GitHub Actions logs](https://github.com/ahadalichowdhury/ClipSync/actions)
3. Open an [issue](https://github.com/ahadalichowdhury/ClipSync/issues) with:
   - Operating system and version
   - Node.js version
   - Complete error logs
   - Steps to reproduce
