# Project Setup Guide

This guide will help you set up the ClipSync development environment on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js** (v18.0.0 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
- **npm** (v8.0.0 or higher) or **yarn**
  - Comes with Node.js
  - Verify installation: `npm --version`
- **Git**
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

### Platform-Specific Requirements

#### macOS

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install Homebrew (optional but recommended)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Linux (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install build essentials
sudo apt install build-essential

# Install additional dependencies
sudo apt install libnss3-dev libatk-bridge2.0-dev libdrm2 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2
```

#### Windows

- Install **Visual Studio Build Tools** or **Visual Studio Community**
- Install **Python 3.x** (required for node-gyp)
- Install **Git for Windows**

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/clipsync.git

# Navigate to the project directory
cd clipsync
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm install

# Or if you prefer yarn
yarn install
```

This will install:

- **Production dependencies**: Electron, React, Zustand, SQLite, etc.
- **Development dependencies**: TypeScript, ESLint, Prettier, Jest, etc.
- **Build tools**: Electron Builder, Vite, etc.

### 3. Environment Setup

Create a `.env` file in the root directory (optional):

```bash
# .env
NODE_ENV=development
ELECTRON_IS_DEV=true
DEBUG=clipsync:*
```

### 4. Verify Installation

```bash
# Check if all dependencies are installed correctly
npm run typecheck

# Run linting
npm run lint

# Run tests
npm test
```

## 🛠 Development Workflow

### Starting Development Server

```bash
# Start the development server (both main and renderer processes)
npm run dev

# Or start them separately
npm run dev:main    # Start main process only
npm run dev:renderer # Start renderer process only
```

This will:

- Start the Electron main process
- Start the Vite development server for the renderer
- Open the application window
- Enable hot reload for both processes

### Building the Application

```bash
# Build for development
npm run build

# Build for production
npm run compile

# Build and package for current platform
npm run package

# Build and package for all platforms
npm run dist
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run end-to-end tests
npm run test:e2e
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

## 📁 Project Structure

After setup, your project structure should look like this:

```
clipsync/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── index.ts         # Main entry point
│   │   ├── clipboard.ts     # Clipboard monitoring
│   │   ├── json-storage.ts  # JSON storage manager
│   │   ├── settings.ts      # Settings management
│   │   └── createTrayIcon.ts # System tray
│   ├── renderer/            # Electron renderer process
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   ├── hooks/       # Custom hooks
│   │   │   ├── stores/      # Zustand stores
│   │   │   ├── utils/       # Utility functions
│   │   │   ├── styles/      # CSS files
│   │   │   └── App.tsx      # Main React app
│   │   └── index.html       # HTML template
│   └── preload/             # Preload scripts
│       └── index.ts         # IPC bridge
├── tests/                   # Test files
├── docs/                    # Documentation
├── assets/                  # Static assets
├── dist/                    # Built files
├── release/                 # Packaged applications
└── node_modules/            # Dependencies
```

## 🔧 Configuration Files

The project includes several configuration files:

- **`package.json`**: Project metadata and scripts
- **`tsconfig.json`**: TypeScript configuration
- **`electron.vite.config.ts`**: Vite configuration for Electron
- **`tailwind.config.js`**: Tailwind CSS configuration
- **`.eslintrc.js`**: ESLint configuration
- **`.prettierrc`**: Prettier configuration
- **`jest.config.js`**: Jest testing configuration

## 🐛 Troubleshooting

### Common Issues

#### 1. Node.js Version Issues

```bash
# Check Node.js version
node --version

# If version is too old, update Node.js
# Use nvm (Node Version Manager) for easy version management
nvm install 18
nvm use 18
```

#### 2. Native Dependencies Issues

```bash
# Rebuild native dependencies
npm rebuild

# Or clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. Permission Issues (macOS/Linux)

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

#### 4. Windows Build Issues

```bash
# Install windows-build-tools
npm install --global windows-build-tools

# Or install Visual Studio Build Tools manually
```

### Platform-Specific Issues

#### macOS

- **Code signing issues**: Disable Gatekeeper temporarily during development
- **Notarization**: Required for distribution outside App Store

#### Linux

- **AppImage permissions**: Make sure the AppImage has execute permissions
- **Missing libraries**: Install required system libraries

#### Windows

- **Antivirus interference**: Add project folder to antivirus exclusions
- **Path length limits**: Enable long path support in Windows

## 📚 Next Steps

After successful setup:

1. **Read the documentation**: Check out `docs/DEVELOPMENT.md` for detailed development guidelines
2. **Explore the codebase**: Start with `src/main/index.ts` and `src/renderer/src/App.tsx`
3. **Run the application**: Use `npm run dev` to start development
4. **Make your first change**: Try modifying the UI or adding a new feature
5. **Write tests**: Add tests for any new functionality

## 🤝 Getting Help

If you encounter issues:

1. **Check the documentation**: Look through the `docs/` folder
2. **Search existing issues**: Check the GitHub issues page
3. **Create a new issue**: Provide detailed information about your problem
4. **Join the community**: Participate in discussions

## 📝 Development Tips

### Hot Reload

- The renderer process supports hot reload for React components
- The main process requires a restart for changes to take effect
- Use `npm run dev` for the best development experience

### Debugging

- Use Chrome DevTools for renderer process debugging
- Use VS Code debugger for main process debugging
- Enable verbose logging with `DEBUG=clipsync:*`

### Performance

- Use React DevTools for component performance analysis
- Monitor memory usage during development
- Test with large clipboard histories

### Cross-Platform Testing

- Test on multiple operating systems
- Use virtual machines or CI/CD for comprehensive testing
- Pay attention to platform-specific behaviors

## 🔄 Keeping Updated

```bash
# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Update to latest versions (be careful)
npx npm-check-updates -u
npm install
```

Remember to test thoroughly after updating dependencies!
