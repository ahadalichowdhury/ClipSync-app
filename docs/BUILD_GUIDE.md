# 🚀 ClipSync - Complete Build Guide

**Follow these instructions to build ClipSync for all platforms.**

## **📋 Prerequisites**

### **Required Software**

```bash
# Install Node.js (18+)
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 8.0.0 or higher

# Install dependencies
npm install
```

### **Platform-Specific Requirements**

#### **Windows (for .exe)**

- Windows 10/11
- PowerShell (built-in)
- Optional: Code signing certificate

#### **macOS (for .dmg)**

- macOS 10.15+ (Catalina or newer)
- Xcode Command Line Tools: `xcode-select --install`
- Optional: Apple Developer account for notarization

#### **Linux (for AppImage/deb/rpm)**

- Any Linux distro
- Build tools: `sudo apt install build-essential` (Ubuntu/Debian)

---

## **🪟 Windows Build (.exe + installer)**

### **Option 1: Quick Build (No Signing)**

```bash
# Build without code signing (FREE)
npm run dist:unsigned
```

**Output:** `release/ClipSync Setup 1.0.0.exe`

### **Option 2: Self-Signed Certificate (Recommended)**

```bash
# Step 1: Create FREE self-signed certificate
powershell -ExecutionPolicy Bypass -File scripts/create-self-signed-cert.ps1

# Step 2: Set environment variables
set WINDOWS_CERT_FILE=certificates/windows-cert.p12
set WINDOWS_CERT_PASSWORD=clipsync2024

# Step 3: Build with signing
npm run dist:win
```

**Output:** `release/ClipSync Setup 1.0.0.exe` (signed)

### **Option 3: Commercial Certificate**

```bash
# Step 1: Get certificate from DigiCert/Sectigo ($200/year)
# Step 2: Place certificate in certificates/windows-cert.p12
# Step 3: Set password
set WINDOWS_CERT_PASSWORD=your_cert_password

# Step 4: Build
npm run dist:win
```

### **Windows Build Outputs**

- `ClipSync Setup 1.0.0.exe` - NSIS installer
- `ClipSync 1.0.0.exe` - Portable executable
- Both in `release/` folder

---

## **🍎 macOS Build (.dmg)**

### **Option 1: Quick Build (No Notarization)**

```bash
# Build for current architecture
npm run dist:mac

# Or build for specific architecture
npm run dist:mac:x64     # Intel Macs
npm run dist:mac:arm64   # Apple Silicon (M1/M2)
npm run dist:mac:universal  # Both architectures
```

**Output:** `release/ClipSync-1.0.0.dmg`

### **Option 2: With Code Signing**

```bash
# Step 1: Install Xcode and sign in with Apple ID
# Step 2: Create Developer ID certificate in Keychain Access
# Step 3: Build
npm run dist:mac
```

### **Option 3: With Notarization (App Store Ready)**

```bash
# Step 1: Get Apple Developer account ($99/year)
# Step 2: Set up certificates and provisioning
# Step 3: Configure notarization in package.json
# Step 4: Build
npm run dist:mac
```

### **macOS Build Outputs**

- `ClipSync-1.0.0.dmg` - Disk image installer
- `ClipSync-1.0.0-mac.zip` - Zip archive
- Both in `release/` folder

---

## **🐧 Linux Build (Multiple Formats)**

### **Option 1: All Linux Packages**

```bash
# Build all Linux formats
npm run dist:linux
```

### **Option 2: Specific Formats**

```bash
# AppImage only (universal)
npx electron-builder --linux AppImage

# Debian package only
npx electron-builder --linux deb

# RPM package only
npx electron-builder --linux rpm

# Snap package only
npx electron-builder --linux snap
```

### **Linux Build Outputs**

- `ClipSync-1.0.0.AppImage` - Universal Linux app
- `clipsync_1.0.0_amd64.deb` - Debian/Ubuntu package
- `clipsync-1.0.0.x86_64.rpm` - Red Hat/Fedora package
- `clipsync_1.0.0_amd64.snap` - Snap package
- All in `release/` folder

---

## **🌍 Cross-Platform Build (All Platforms)**

### **Build Everything at Once**

```bash
# Clean previous builds
rm -rf release/

# Build for all platforms
npm run build
npm run dist
```

**Note:** You can only build for your current platform unless using CI/CD.

---

## **📦 Distribution Setup (FREE Options)**

### **Windows Distribution**

```bash
# Option 1: Direct distribution (share .exe file)
# Users will see "Unknown Publisher" but can click "Run anyway"

# Option 2: Self-signed certificate (recommended)
powershell -ExecutionPolicy Bypass -File scripts/create-self-signed-cert.ps1
# Then build with signing

# Option 3: Microsoft Store ($19 one-time fee)
# Submit to Microsoft Partner Center
```

### **macOS Distribution**

```bash
# Option 1: Direct distribution (share .dmg file)
# Users need to right-click → Open first time

# Option 2: Developer ID signing (free with Apple ID)
# Sign with Developer ID certificate

# Option 3: Mac App Store ($99/year)
# Submit to App Store Connect
```

### **Linux Distribution**

```bash
# Option 1: Direct distribution (share AppImage/packages)
npm run dist:linux

# Option 2: Snap Store (FREE and trusted)
npm run setup:snap
snapcraft login
snapcraft
snapcraft upload clipsync_1.0.0_amd64.snap

# Option 3: Flathub (FREE and highly trusted)
npm run setup:flatpak
# Then submit to Flathub repository

# Option 4: AUR (Arch Linux)
# Create PKGBUILD and submit to AUR
```

---

## **🔧 Troubleshooting**

### **Common Issues**

#### **Windows**

```bash
# PowerShell execution policy error
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Missing dependencies
npm install --save-dev electron-builder

# Certificate not found
# Make sure certificates/windows-cert.p12 exists
```

#### **macOS**

```bash
# Xcode tools missing
xcode-select --install

# Code signing identity not found
# Check Keychain Access for Developer ID certificates

# Notarization failed
# Verify Apple Developer account and app-specific password
```

#### **Linux**

```bash
# Missing build tools
sudo apt install build-essential  # Ubuntu/Debian
sudo yum groupinstall "Development Tools"  # RHEL/CentOS
sudo pacman -S base-devel  # Arch

# AppImage not executable
chmod +x ClipSync-1.0.0.AppImage

# Snap build failed
sudo snap install snapcraft --classic
```

---

## **📊 Build Comparison**

| Platform    | Build Time | Output Size | Trust Level | Distribution  |
| ----------- | ---------- | ----------- | ----------- | ------------- |
| **Windows** | 2-5 min    | 150-200 MB  | 40-70%      | Direct/Store  |
| **macOS**   | 3-7 min    | 120-180 MB  | 60-95%      | Direct/Store  |
| **Linux**   | 2-4 min    | 100-150 MB  | 40-99%      | Multiple FREE |

---

## **🚀 Quick Reference Commands**

### **Development**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview built app
```

### **Testing**

```bash
npm test            # Run unit tests
npm run test:e2e    # Run end-to-end tests
npm run lint        # Check code quality
```

### **Building**

```bash
npm run dist:unsigned    # Build without signing (all platforms)
npm run dist:win        # Windows with signing
npm run dist:mac        # macOS with signing
npm run dist:linux      # Linux all formats
```

### **Distribution Setup**

```bash
npm run setup:snap      # Setup Snap Store publishing
npm run setup:flatpak   # Setup Flathub publishing
```

---

## **💡 Pro Tips**

1. **Always test on target platform** before distributing
2. **Use unsigned builds** for development and testing
3. **Self-signed certificates** are great for personal/internal use
4. **Snap Store and Flathub** are the best FREE options for Linux
5. **Keep certificates secure** and never commit them to git
6. **Use CI/CD** (GitHub Actions) for automated builds
7. **Version your releases** properly for auto-updates

---

## **🎯 Recommended Workflow**

### **For Personal Use**

```bash
npm run dist:unsigned
```

### **For Public Distribution**

```bash
# Windows: Self-signed certificate
powershell -ExecutionPolicy Bypass -File scripts/create-self-signed-cert.ps1
npm run dist:win

# macOS: Developer ID signing
npm run dist:mac

# Linux: Publish to stores
npm run setup:snap
npm run setup:flatpak
npm run dist:linux
```

**Happy building! 🚀**
