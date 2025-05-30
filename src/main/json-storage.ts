import { app } from 'electron';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { ClipboardEntry, GetHistoryOptions } from '../shared/types';

interface StorageData {
  entries: ClipboardEntry[];
  settings: Record<string, any>;
  version: string;
  lastSaved: string;
}

export class JsonStorageManager {
  private dataPath: string;
  private data: StorageData;
  private saveTimeout: NodeJS.Timeout | null = null;
  private nextId: number = 1;

  constructor() {
    // Store in user data directory
    const userDataPath = app.getPath('userData');
    this.dataPath = join(userDataPath, 'localclip-data.json');

    // Initialize data structure
    this.data = {
      entries: [],
      settings: {},
      version: '1.0.0',
      lastSaved: new Date().toISOString(),
    };

    // Load existing data
    this.loadData();

    // Set next ID based on existing entries
    this.updateNextId();
  }

  private loadData(): void {
    try {
      if (existsSync(this.dataPath)) {
        const fileContent = readFileSync(this.dataPath, 'utf8');
        const loadedData = JSON.parse(fileContent) as StorageData;

        // Validate and merge data
        this.data = {
          entries: Array.isArray(loadedData.entries)
            ? loadedData.entries.map(this.validateEntry)
            : [],
          settings: loadedData.settings || {},
          version: loadedData.version || '1.0.0',
          lastSaved: loadedData.lastSaved || new Date().toISOString(),
        };

        console.log(
          `📁 Loaded ${this.data.entries.length} clipboard entries from JSON storage`
        );
      } else {
        console.log(
          '📁 No existing data file found, starting with empty storage'
        );
      }
    } catch (error) {
      console.error('❌ Error loading data from JSON storage:', error);
      // Keep default empty data structure
      console.log('📁 Starting with empty storage due to load error');
    }
  }

  private validateEntry(entry: any): ClipboardEntry {
    // Ensure all required fields exist with defaults
    return {
      id: entry.id || 0,
      content: entry.content || '',
      contentType: entry.contentType || 'text',
      format: entry.format || 'text',
      preview: entry.preview || entry.content?.substring(0, 100) || '',
      filePath: entry.filePath || undefined,
      appName: entry.appName || 'Unknown App',
      createdAt: entry.createdAt ? new Date(entry.createdAt) : new Date(),
      updatedAt: entry.updatedAt ? new Date(entry.updatedAt) : new Date(),
      isPinned: Boolean(entry.isPinned),
      isFavorite: Boolean(entry.isFavorite),
      category: entry.category || undefined,
      tags: Array.isArray(entry.tags) ? entry.tags : [],
      usageCount: entry.usageCount || 0,
      lastUsedAt: entry.lastUsedAt ? new Date(entry.lastUsedAt) : undefined,
      note: entry.note || undefined,
    };
  }

  private updateNextId(): void {
    if (this.data.entries.length > 0) {
      this.nextId = Math.max(...this.data.entries.map(e => e.id)) + 1;
    }
  }

  private saveData(): void {
    try {
      // Ensure directory exists
      const dir = dirname(this.dataPath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      // Update last saved timestamp
      this.data.lastSaved = new Date().toISOString();

      // Write to file
      const jsonData = JSON.stringify(this.data, null, 2);
      writeFileSync(this.dataPath, jsonData, 'utf8');

      console.log(
        `💾 Saved ${this.data.entries.length} entries to JSON storage`
      );
    } catch (error) {
      console.error('❌ Error saving data to JSON storage:', error);
    }
  }

  private debouncedSave(): void {
    // Clear existing timeout
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    // Save after 1 second of inactivity
    this.saveTimeout = setTimeout(() => {
      this.saveData();
      this.saveTimeout = null;
    }, 1000);
  }

  // Clipboard Entry Operations
  async getClipboardHistory(
    options: GetHistoryOptions = {}
  ): Promise<ClipboardEntry[]> {
    const {
      limit = 100,
      offset = 0,
      category,
      contentType,
      searchQuery,
    } = options;

    let filtered = [...this.data.entries];

    // Filter by category
    if (category && category !== 'all') {
      filtered = filtered.filter(
        entry => entry.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by content type
    if (contentType) {
      filtered = filtered.filter(entry => entry.format === contentType);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        entry =>
          entry.content.toLowerCase().includes(query) ||
          entry.preview?.toLowerCase().includes(query) ||
          entry.category?.toLowerCase().includes(query) ||
          entry.note?.toLowerCase().includes(query)
      );
    }

    // Separate pinned and non-pinned entries
    const pinnedEntries = filtered.filter(entry => entry.isPinned);
    const nonPinnedEntries = filtered.filter(entry => !entry.isPinned);

    // Sort pinned entries by creation date (newest first)
    pinnedEntries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Sort non-pinned entries by creation date (newest first)
    nonPinnedEntries.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    // Apply limit only to non-pinned entries, but show all pinned entries
    const limitedNonPinned = nonPinnedEntries.slice(offset, offset + limit);

    // Combine: all pinned entries first, then limited non-pinned entries
    return [...pinnedEntries, ...limitedNonPinned];
  }

  async addClipboardEntry(
    entry: Omit<ClipboardEntry, 'id' | 'createdAt' | 'updatedAt'>,
    maxHistoryItems: number = 40
  ): Promise<ClipboardEntry> {
    // Create new entry with ID and timestamps
    const newEntry: ClipboardEntry = {
      ...entry,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add to beginning of array (most recent first)
    this.data.entries.unshift(newEntry);

    // Enforce limit for non-pinned items only
    if (!entry.isPinned) {
      await this.enforceHistoryLimit(maxHistoryItems);
    }

    // Save changes
    this.debouncedSave();

    console.log(`📝 Added new clipboard entry (ID: ${newEntry.id})`);
    return newEntry;
  }

  async enforceHistoryLimit(maxHistoryItems: number): Promise<void> {
    const clampedLimit = Math.max(20, Math.min(100, maxHistoryItems));

    // Count non-pinned entries
    const nonPinnedEntries = this.data.entries.filter(e => !e.isPinned);
    const nonPinnedCount = nonPinnedEntries.length;

    console.log(
      `📊 FIFO Check: ${nonPinnedCount} non-pinned items, limit: ${clampedLimit} (pinned items protected)`
    );

    if (nonPinnedCount > clampedLimit) {
      const excessCount = nonPinnedCount - clampedLimit;
      console.log(
        `⚠️ Limit exceeded! Removing ${excessCount} oldest non-pinned items...`
      );

      // Sort non-pinned entries by creation date (oldest first)
      const sortedNonPinned = nonPinnedEntries.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      );

      // Get IDs of items to delete
      const idsToDelete = sortedNonPinned.slice(0, excessCount).map(e => e.id);

      console.log(
        '🔍 Items to delete:',
        idsToDelete.map(id => {
          const entry = this.data.entries.find(e => e.id === id);
          return {
            id,
            content: entry?.content.substring(0, 20) + '...',
            created_at: entry?.createdAt.toISOString(),
          };
        })
      );

      // Remove from entries array
      this.data.entries = this.data.entries.filter(
        e => !idsToDelete.includes(e.id)
      );

      console.log(
        `🗑️ Successfully DELETED ${excessCount} oldest clipboard entries from storage`
      );

      // Verify counts
      const newNonPinnedCount = this.data.entries.filter(
        e => !e.isPinned
      ).length;
      const pinnedCount = this.data.entries.filter(e => e.isPinned).length;
      console.log(
        `✅ After cleanup: ${newNonPinnedCount} non-pinned items remaining, ${pinnedCount} pinned items protected, ${this.data.entries.length} total`
      );
    } else {
      console.log('✅ Within limit, no cleanup needed');
    }
  }

  async updateClipboardEntry(
    id: number,
    updates: Partial<ClipboardEntry>
  ): Promise<ClipboardEntry | null> {
    const entryIndex = this.data.entries.findIndex(e => e.id === id);
    if (entryIndex === -1) return null;

    // Update entry
    const entry = this.data.entries[entryIndex];
    Object.assign(entry, updates, {
      updatedAt: new Date(),
      id: entry.id, // Preserve ID
      createdAt: entry.createdAt, // Preserve creation date
    });

    this.debouncedSave();
    console.log(`📝 Updated clipboard entry (ID: ${id})`);
    return entry;
  }

  async deleteClipboardEntry(id: number): Promise<boolean> {
    const initialLength = this.data.entries.length;
    this.data.entries = this.data.entries.filter(e => e.id !== id);

    if (this.data.entries.length < initialLength) {
      this.debouncedSave();
      console.log(`🗑️ Deleted clipboard entry (ID: ${id})`);
      return true;
    }
    return false;
  }

  async pinClipboardEntry(id: number): Promise<ClipboardEntry | null> {
    const entry = this.data.entries.find(e => e.id === id);
    if (!entry) return null;

    entry.isPinned = !entry.isPinned;
    entry.updatedAt = new Date();

    this.debouncedSave();
    console.log(
      `📌 ${entry.isPinned ? 'Pinned' : 'Unpinned'} clipboard entry (ID: ${id})`
    );
    return entry;
  }

  async clearClipboardHistory(): Promise<boolean> {
    const initialLength = this.data.entries.length;
    this.data.entries = this.data.entries.filter(e => e.isPinned);

    if (this.data.entries.length < initialLength) {
      this.debouncedSave();
      const deletedCount = initialLength - this.data.entries.length;
      console.log(`🗑️ Cleared ${deletedCount} non-pinned clipboard entries`);
      return true;
    }
    return false;
  }

  // Count methods
  getClipboardEntryCount(): number {
    return this.data.entries.length;
  }

  getNonPinnedEntryCount(): number {
    return this.data.entries.filter(e => !e.isPinned).length;
  }

  getPinnedEntryCount(): number {
    return this.data.entries.filter(e => e.isPinned).length;
  }

  // Settings operations
  async getSetting(key: string): Promise<any> {
    return this.data.settings[key];
  }

  async setSetting(key: string, value: any): Promise<void> {
    this.data.settings[key] = value;
    this.debouncedSave();
    console.log(`⚙️ Updated setting: ${key} = ${JSON.stringify(value)}`);
  }

  async getAllSettings(): Promise<Record<string, any>> {
    return { ...this.data.settings };
  }

  // Cleanup
  close(): void {
    // Cancel any pending save
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }

    // Force final save
    this.saveData();
    console.log('💾 JSON storage closed and final save completed');
  }
}
