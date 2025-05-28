# ClipSync - Cross-Platform Clipboard Manager

A modern, Windows 11-inspired clipboard manager built with Electron.js for seamless cross-platform compatibility on Linux, macOS, and Windows.

## 🚀 Features

### Core Clipboard Features

- **Multi-format Support**: Text, images, files, rich text (HTML), and code snippets
- **Clipboard History**: Store up to 1000 clipboard entries with configurable limits
- **Real-time Monitoring**: Automatic clipboard change detection
- **Quick Access**: Global hotkey support (Ctrl/Cmd + Shift + V), use custom option for set hot key
- **Search & Filter**: Instant search through clipboard history
- **Pin Favorites**: Pin frequently used items for quick access

### Windows 11-Inspired UI

- **Modern Design**: Clean, minimalist interface matching Windows 11 aesthetics
- **Dark/Light Theme**: Automatic theme switching based on system preferences
- **Fluent Design**: Acrylic blur effects and smooth animations
- **Grid/List View**: Toggle between different viewing modes
- **Preview Support**: Rich previews for images, text, and files

### Advanced Features

- **Smart Categories**: Auto-categorization (Text, Images, Files, URLs, etc.)
- **Sync Across Devices**: Optional cloud sync (future feature)
- **Privacy Mode**: Exclude sensitive apps from clipboard monitoring
- **Custom Shortcuts**: User-defined keyboard shortcuts
- **Export/Import**: Backup and restore clipboard history
- **Statistics**: Usage analytics and insights

### Security & Privacy

- **Local Storage**: All data stored locally by default
- **Encryption**: Optional encryption for sensitive clipboard data
- **Auto-cleanup**: Configurable automatic cleanup of old entries
- **Blacklist Apps**: Exclude specific applications from monitoring

## 🛠 Technology Stack

- **Frontend**: Electron.js with React
- **UI Framework**: React with Tailwind CSS
- **Database**: mainly store on the local own pc, otherwise use mongodb
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Build Tool**: Vite
- **Testing**: Jest + React Testing Library

## 📁 Project Structure

```
clipboard/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── index.ts         # Main entry point
│   │   ├── clipboard.ts     # Clipboard monitoring
│   │   ├── database.ts      # SQLite database operations
│   │   ├── shortcuts.ts     # Global shortcuts
│   │   └── tray.ts          # System tray integration
│   ├── renderer/            # Electron renderer process
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── stores/          # Zustand stores
│   │   ├── utils/           # Utility functions
│   │   ├── styles/          # CSS and Tailwind config
│   │   └── App.tsx          # Main React app
│   └── preload/             # Preload scripts
│       └── index.ts         # IPC bridge
├── assets/                  # Static assets
├── build/                   # Build configuration
├── dist/                    # Built application
├── docs/                    # Documentation
└── tests/                   # Test files
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd clipboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run package` - Package app for current platform
- `npm run dist` - Build and package for all platforms

## 🎯 Development Roadmap

### Phase 1: Core Foundation (Weeks 1-2)

- [x] Project setup and configuration
- [ ] Basic Electron app structure
- [ ] Clipboard monitoring implementation
- [ ] SQLite database setup
- [ ] Basic UI components

### Phase 2: Essential Features (Weeks 3-4)

- [ ] Clipboard history display
- [ ] Search and filter functionality
- [ ] Global hotkey support
- [ ] System tray integration
- [ ] Basic settings panel

### Phase 3: Advanced UI (Weeks 5-6)

- [ ] Windows 11-inspired design system
- [ ] Dark/light theme support
- [ ] Animations and transitions
- [ ] Preview components
- [ ] Grid/list view toggle

### Phase 4: Enhanced Features (Weeks 7-8)

- [ ] Smart categorization
- [ ] Pin favorites functionality
- [ ] Export/import features
- [ ] Privacy and security settings
- [ ] Statistics dashboard

### Phase 5: Polish & Distribution (Weeks 9-10)

- [ ] Performance optimization
- [ ] Cross-platform testing
- [ ] Auto-updater implementation
- [ ] Documentation completion
- [ ] Package for distribution

## 🔧 Configuration

The app supports extensive configuration through a settings file:

```json
{
  "maxHistoryItems": 1000,
  "globalHotkey": "CommandOrControl+Shift+V",
  "theme": "auto",
  "autoStart": true,
  "monitorClipboard": true,
  "excludedApps": [],
  "categories": {
    "autoDetect": true,
    "customCategories": []
  },
  "privacy": {
    "encryptData": false,
    "autoCleanup": true,
    "cleanupDays": 30
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Windows 11 Clipboard
- Built with the amazing Electron.js framework
- UI components inspired by modern design systems
