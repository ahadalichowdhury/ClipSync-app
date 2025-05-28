# Development Documentation

## 🏗 Architecture Overview

ClipSync follows a modern Electron architecture with clear separation between main and renderer processes, utilizing IPC for secure communication.

### Process Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Main Process                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Clipboard     │  │    Database     │  │   System    │ │
│  │   Monitor       │  │    Manager      │  │   Tray      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│           │                     │                   │       │
│           └─────────────────────┼───────────────────┘       │
│                                 │                           │
│                        ┌─────────────────┐                 │
│                        │  IPC Bridge     │                 │
│                        │  (Preload)      │                 │
│                        └─────────────────┘                 │
└─────────────────────────────────┼───────────────────────────┘
                                  │
┌─────────────────────────────────┼───────────────────────────┐
│                    Renderer Process                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │     React       │  │    Zustand      │  │  Tailwind   │ │
│  │   Components    │  │    Stores       │  │     CSS     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Technical Implementation

### 1. Clipboard Monitoring

The clipboard monitoring system uses native APIs for each platform:

**Features:**

- Real-time clipboard change detection
- Multi-format support (text, images, files, HTML)
- Debounced updates to prevent spam
- Platform-specific optimizations

**Implementation Strategy:**

```typescript
// src/main/clipboard.ts
class ClipboardMonitor {
  private interval: NodeJS.Timeout | null = null;
  private lastClipboardContent: string = "";

  start() {
    this.interval = setInterval(() => {
      this.checkClipboard();
    }, 500); // Check every 500ms
  }

  private async checkClipboard() {
    // Platform-specific clipboard reading
    // Detect format changes
    // Store in database
    // Notify renderer process
  }
}
```

### 2. Database Schema

Using SQLite with the following schema:

```sql
-- Clipboard entries table
CREATE TABLE clipboard_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  format VARCHAR(20) NOT NULL, -- 'text', 'image', 'file', 'html'
  preview TEXT,
  file_path TEXT,
  app_name VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_favorite BOOLEAN DEFAULT FALSE,
  category VARCHAR(50),
  tags TEXT, -- JSON array of tags
  usage_count INTEGER DEFAULT 0,
  last_used_at DATETIME
);

-- Settings table
CREATE TABLE settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL,
  color VARCHAR(7), -- Hex color
  icon VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_clipboard_created_at ON clipboard_entries(created_at DESC);
CREATE INDEX idx_clipboard_format ON clipboard_entries(format);
CREATE INDEX idx_clipboard_pinned ON clipboard_entries(is_pinned);
CREATE INDEX idx_clipboard_category ON clipboard_entries(category);
```

### 3. IPC Communication

Secure communication between main and renderer processes:

```typescript
// src/preload/index.ts
const electronAPI = {
  // Clipboard operations
  getClipboardHistory: () => ipcRenderer.invoke("clipboard:getHistory"),
  addClipboardEntry: (entry: ClipboardEntry) =>
    ipcRenderer.invoke("clipboard:add", entry),
  deleteClipboardEntry: (id: number) =>
    ipcRenderer.invoke("clipboard:delete", id),
  pinClipboardEntry: (id: number) => ipcRenderer.invoke("clipboard:pin", id),

  // Settings
  getSettings: () => ipcRenderer.invoke("settings:get"),
  updateSettings: (settings: Partial<Settings>) =>
    ipcRenderer.invoke("settings:update", settings),

  // System integration
  showWindow: () => ipcRenderer.invoke("window:show"),
  hideWindow: () => ipcRenderer.invoke("window:hide"),

  // Event listeners
  onClipboardChange: (callback: (entry: ClipboardEntry) => void) =>
    ipcRenderer.on("clipboard:changed", (_, entry) => callback(entry)),
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
```

### 4. State Management

Using Zustand for predictable state management:

```typescript
// src/renderer/stores/clipboardStore.ts
interface ClipboardStore {
  entries: ClipboardEntry[];
  filteredEntries: ClipboardEntry[];
  searchQuery: string;
  selectedCategory: string;
  viewMode: "grid" | "list";

  // Actions
  setEntries: (entries: ClipboardEntry[]) => void;
  addEntry: (entry: ClipboardEntry) => void;
  removeEntry: (id: number) => void;
  updateEntry: (id: number, updates: Partial<ClipboardEntry>) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  toggleViewMode: () => void;
}

const useClipboardStore = create<ClipboardStore>((set, get) => ({
  entries: [],
  filteredEntries: [],
  searchQuery: "",
  selectedCategory: "all",
  viewMode: "grid",

  setEntries: (entries) => set({ entries, filteredEntries: entries }),
  addEntry: (entry) =>
    set((state) => ({
      entries: [entry, ...state.entries],
      filteredEntries: [entry, ...state.filteredEntries],
    })),
  // ... other actions
}));
```

## 🎨 UI/UX Design System

### Windows 11 Design Principles

1. **Fluent Design System**

   - Acrylic blur effects
   - Subtle shadows and depth
   - Rounded corners (8px radius)
   - Smooth animations (200-300ms)

2. **Color Palette**

   ```css
   :root {
     /* Light theme */
     --bg-primary: #ffffff;
     --bg-secondary: #f3f3f3;
     --bg-tertiary: #fafafa;
     --text-primary: #323130;
     --text-secondary: #605e5c;
     --accent: #0078d4;
     --accent-hover: #106ebe;

     /* Dark theme */
     --bg-primary-dark: #202020;
     --bg-secondary-dark: #2c2c2c;
     --bg-tertiary-dark: #383838;
     --text-primary-dark: #ffffff;
     --text-secondary-dark: #cccccc;
   }
   ```

3. **Typography**
   - Primary: Segoe UI Variable (Windows), SF Pro (macOS), Inter (Linux)
   - Font sizes: 12px, 14px, 16px, 20px, 24px
   - Font weights: 400 (regular), 600 (semibold)

### Component Library

```typescript
// src/renderer/components/ui/Button.tsx
interface ButtonProps {
  variant: "primary" | "secondary" | "ghost";
  size: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
}

// src/renderer/components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  selected?: boolean;
}
```

## 🔒 Security Considerations

### 1. Data Protection

- **Local Storage**: All clipboard data stored locally by default
- **Encryption**: Optional AES-256 encryption for sensitive data
- **Secure Deletion**: Proper data wiping when entries are deleted

### 2. Privacy Features

- **App Blacklisting**: Exclude sensitive applications (password managers, banking apps)
- **Incognito Mode**: Temporary disable clipboard monitoring
- **Auto-cleanup**: Automatic deletion of old entries

### 3. Electron Security

- **Context Isolation**: Enabled for all renderer processes
- **Node Integration**: Disabled in renderer processes
- **Content Security Policy**: Strict CSP headers
- **Preload Scripts**: Minimal API exposure through contextBridge

## 🧪 Testing Strategy

### 1. Unit Tests

```typescript
// tests/unit/clipboard.test.ts
describe("ClipboardMonitor", () => {
  test("should detect text clipboard changes", async () => {
    const monitor = new ClipboardMonitor();
    const mockCallback = jest.fn();

    monitor.on("change", mockCallback);
    // Simulate clipboard change

    expect(mockCallback).toHaveBeenCalledWith({
      type: "text",
      content: "test content",
    });
  });
});
```

### 2. Integration Tests

- IPC communication testing
- Database operations testing
- Cross-platform compatibility testing

### 3. E2E Tests

```typescript
// tests/e2e/app.test.ts
describe("ClipSync App", () => {
  test("should show clipboard history on hotkey", async () => {
    const app = await startApp();

    // Simulate global hotkey
    await app.webContents.sendInputEvent({
      type: "keyDown",
      keyCode: "V",
      modifiers: ["control", "shift"],
    });

    expect(await app.isVisible()).toBe(true);
  });
});
```

## 📦 Build & Distribution

### 1. Build Configuration

```json
// electron-builder.json
{
  "appId": "com.clipsync.app",
  "productName": "ClipSync",
  "directories": {
    "output": "dist"
  },
  "files": ["build/**/*", "node_modules/**/*"],
  "mac": {
    "category": "public.app-category.productivity",
    "target": [
      {
        "target": "dmg",
        "arch": ["x64", "arm64"]
      }
    ]
  },
  "win": {
    "target": [
      {
        "target": "nsis",
        "arch": ["x64", "ia32"]
      }
    ]
  },
  "linux": {
    "target": [
      {
        "target": "AppImage",
        "arch": ["x64"]
      },
      {
        "target": "deb",
        "arch": ["x64"]
      }
    ]
  }
}
```

### 2. Auto-updater

- Implement electron-updater for automatic updates
- Code signing for security
- Delta updates for efficiency

## 🚀 Performance Optimization

### 1. Memory Management

- Implement virtual scrolling for large clipboard histories
- Lazy loading of images and file previews
- Periodic garbage collection

### 2. Database Optimization

- Indexed queries for fast search
- Pagination for large datasets
- Background cleanup of old entries

### 3. UI Performance

- React.memo for expensive components
- Debounced search input
- Optimized re-renders with Zustand selectors

## 🔄 Development Workflow

### 1. Git Workflow

```bash
# Feature development
git checkout -b feature/clipboard-monitoring
git commit -m "feat: implement clipboard monitoring"
git push origin feature/clipboard-monitoring

# Create pull request
# Code review
# Merge to main
```

### 2. Code Quality

- ESLint + Prettier for code formatting
- Husky for pre-commit hooks
- TypeScript for type safety
- Jest for testing

### 3. CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run build
```

## 📚 Additional Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Windows 11 Design Guidelines](https://docs.microsoft.com/en-us/windows/apps/design/)
- [macOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/macos)
