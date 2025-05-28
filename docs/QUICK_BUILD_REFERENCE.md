# ⚡ Quick Build Reference

**Copy-paste commands for building ClipSync**

## **🚀 One-Command Builds**

### **All Platforms (No Signing)**

```bash
npm run dist:unsigned
```

### **Windows (.exe)**

```bash
# Quick build (unsigned)
npm run dist:unsigned

# With self-signed certificate (recommended)
powershell -ExecutionPolicy Bypass -File scripts/create-self-signed-cert.ps1
set WINDOWS_CERT_FILE=certificates/windows-cert.p12
set WINDOWS_CERT_PASSWORD=clipsync2024
npm run dist:win
```

### **macOS (.dmg)**

```bash
# Current architecture
npm run dist:mac

# Intel Macs
npm run dist:mac:x64

# Apple Silicon (M1/M2)
npm run dist:mac:arm64

# Universal (both)
npm run dist:mac:universal
```

### **Linux (All formats)**

```bash
# All Linux packages
npm run dist:linux

# Setup for stores (FREE)
npm run setup:snap      # Snap Store
npm run setup:flatpak   # Flathub
```

## **📁 Output Locations**

All builds go to: `release/` folder

### **Windows**

- `ClipSync Setup 1.0.0.exe` - Installer
- `ClipSync 1.0.0.exe` - Portable

### **macOS**

- `ClipSync-1.0.0.dmg` - Disk image
- `ClipSync-1.0.0-mac.zip` - Zip archive

### **Linux**

- `ClipSync-1.0.0.AppImage` - Universal
- `clipsync_1.0.0_amd64.deb` - Debian/Ubuntu
- `clipsync-1.0.0.x86_64.rpm` - Red Hat/Fedora
- `clipsync_1.0.0_amd64.snap` - Snap package

## **🔧 Development Commands**

```bash
npm run dev          # Start development
npm run build        # Build for production
npm run preview      # Preview built app
npm test            # Run tests
npm run lint        # Check code quality
```

## **📦 Distribution (FREE)**

### **Windows**

```bash
# Self-signed certificate (70% trust)
powershell -ExecutionPolicy Bypass -File scripts/create-self-signed-cert.ps1
npm run dist:win
```

### **Linux**

```bash
# Snap Store (95% trust)
npm run setup:snap
snapcraft login
snapcraft
snapcraft upload clipsync_1.0.0_amd64.snap

# Flathub (99% trust)
npm run setup:flatpak
# Then submit to Flathub
```

## **⚠️ Troubleshooting**

### **Windows**

```bash
# PowerShell policy error
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **macOS**

```bash
# Missing Xcode tools
xcode-select --install
```

### **Linux**

```bash
# Missing build tools (Ubuntu/Debian)
sudo apt install build-essential

# Make AppImage executable
chmod +x ClipSync-1.0.0.AppImage
```

---

**💡 Tip:** For personal use, just run `npm run dist:unsigned` - it works everywhere!
