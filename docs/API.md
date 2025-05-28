# API Documentation

This document describes the IPC (Inter-Process Communication) API between the main and renderer processes in ClipSync.

## 📡 IPC Communication Overview

ClipSync uses Electron's IPC system for secure communication between processes:

- **Main Process**: Handles system integration, clipboard monitoring, database operations
- **Renderer Process**: Handles UI rendering and user interactions
- **Preload Script**: Provides secure bridge between main and renderer

## 🔧 API Structure

### Base API Interface

```typescript
interface ElectronAPI {
  // Clipboard operations
  clipboard: ClipboardAPI;
  
  // Settings management
  settings: SettingsAPI;
  
  // Window management
  window: WindowAPI;
  
  // System integration
  system: SystemAPI;
  
  // Event listeners
  on: EventAPI;
  
  // Utility functions
  utils: UtilsAPI;
}
```

## 📋 Clipboard API

### Methods

#### `clipboard.getHistory(options?: GetHistoryOptions): Promise<ClipboardEntry[]>`

Retrieves clipboard history with optional filtering and pagination.

**Parameters:**
```typescript
interface GetHistoryOptions {
  limit?: number;           // Maximum number of entries (default: 100)
  offset?: number;          // Pagination offset (default: 0)
  category?: string;        // Filter by category
  contentType?: ContentType; // Filter by content type
  dateRange?: DateRange;    // Filter by date range
  searchQuery?: string;     // Search in content
}
```

**Returns:**
```typescript
interface ClipboardEntry {
  id: number;
  content: string;
  contentType: string;
  format: 'text' | 'image' | 'file' | 'html' | 'rtf';
  preview?: string;
  filePath?: string;
  appName?: string;
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  isFavorite: boolean;
  category?: string;
  tags: string[];
  usageCount: number;
  lastUsedAt?: Date;
}
```

**Example:**
```typescript
// Get recent clipboard entries
const entries = await window.electronAPI.clipboard.getHistory({
  limit: 50,
  category: 'text'
});

// Search clipboard history
const searchResults = await window.electronAPI.clipboard.getHistory({
  searchQuery: 'important document',
  limit: 20
});
```

## ⚙️ Settings API

### Methods

#### `settings.get(key?: string): Promise<Settings | any>`

Retrieves application settings.

**Example:**
```typescript
// Get all settings
const allSettings = await window.electronAPI.settings.get();

// Get specific setting
const maxItems = await window.electronAPI.settings.get('maxHistoryItems');
```

### Settings Schema

```typescript
interface Settings {
  // General
  maxHistoryItems: number;
  autoStart: boolean;
  minimizeToTray: boolean;
  
  // Appearance
  theme: 'light' | 'dark' | 'auto';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  
  // Behavior
  globalHotkey: string;
  monitorClipboard: boolean;
  autoCategories: boolean;
  duplicateDetection: boolean;
  
  // Privacy
  excludedApps: string[];
  incognitoMode: boolean;
  encryptData: boolean;
  autoCleanup: boolean;
  cleanupDays: number;
}
```

## 🪟 Window API

### Methods

#### `window.show(): Promise<void>`

Shows the main application window.

#### `window.hide(): Promise<void>`

Hides the main application window.

#### `window.toggle(): Promise<void>`

Toggles the main application window visibility.

**Example:**
```typescript
// Show window
await window.electronAPI.window.show();

// Toggle window visibility
await window.electronAPI.window.toggle();
```

## 📡 Event API

### Event Listeners

#### `on.clipboardChanged(callback: (entry: ClipboardEntry) => void): () => void`

Listens for clipboard changes.

**Returns:** Unsubscribe function

#### `on.settingsChanged(callback: (settings: Settings) => void): () => void`

Listens for settings changes.

**Example:**
```typescript
// Listen for clipboard changes
const unsubscribe = window.electronAPI.on.clipboardChanged((entry) => {
  console.log('New clipboard entry:', entry);
});

// Unsubscribe when component unmounts
useEffect(() => {
  return unsubscribe;
}, []);
```

## 🔒 Security Considerations

### Context Isolation

All API methods are exposed through the preload script with context isolation enabled.

### Input Validation

All API inputs are validated in the main process.

### Error Handling

All API methods include proper error handling:

```typescript
try {
  const entries = await window.electronAPI.clipboard.getHistory();
} catch (error) {
  console.error('Failed to get clipboard history:', error.message);
}
``` 