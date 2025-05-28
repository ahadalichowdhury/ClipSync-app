export interface ClipboardEntry {
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
  note?: string;
}

export interface GetHistoryOptions {
  limit?: number;
  offset?: number;
  category?: string;
  contentType?: string;
  dateRange?: DateRange;
  searchQuery?: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface Settings {
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

  // Additional
  hideFromDock: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  maxHistoryItems: 40,
  autoStart: true,
  minimizeToTray: true,
  theme: 'auto',
  accentColor: '#0078d4',
  fontSize: 'medium',
  globalHotkey: 'CommandOrControl+Shift+V',
  monitorClipboard: true,
  autoCategories: true,
  duplicateDetection: true,
  excludedApps: [],
  incognitoMode: false,
  encryptData: false,
  autoCleanup: true,
  cleanupDays: 30,
  hideFromDock: false,
};
