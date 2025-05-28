import * as fs from 'fs';
import { JsonStorageManager } from '../src/main/json-storage';

// Mock fs and electron
jest.mock('fs');
jest.mock('electron', () => ({
  app: {
    getPath: jest.fn(() => '/mock/userData'),
  },
}));

const mockFs = fs as jest.Mocked<typeof fs>;

describe('JsonStorageManager', () => {
  let storageManager: JsonStorageManager;
  const mockDataPath = '/mock/userData/clipsync-data.json';

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock file system operations
    mockFs.existsSync.mockReturnValue(false);
    mockFs.mkdirSync.mockImplementation();
    mockFs.readFileSync.mockReturnValue('{}');
    mockFs.writeFileSync.mockImplementation();

    storageManager = new JsonStorageManager();
  });

  afterEach(() => {
    if (storageManager) {
      storageManager.close();
    }
  });

  describe('initialization', () => {
    it('should create data directory when saving data', async () => {
      storageManager = new JsonStorageManager();
      
      // Add an entry to trigger save
      await storageManager.addClipboardEntry({
        content: 'Test content',
        contentType: 'text',
        format: 'text' as const,
        preview: 'Test content',
        appName: 'TestApp',
        isPinned: false,
        isFavorite: false,
        category: 'Text',
        tags: [],
        usageCount: 0,
      });
      
      // Wait for debounced save to complete
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      expect(mockFs.mkdirSync).toHaveBeenCalledWith(
        '/mock/userData',
        { recursive: true }
      );
    });

    it('should initialize with empty data when file does not exist', () => {
      storageManager = new JsonStorageManager();
      expect(storageManager.getClipboardEntryCount()).toBe(0);
    });
  });

  describe('addClipboardEntry', () => {
    beforeEach(() => {
      storageManager = new JsonStorageManager();
    });

    it('should add a new clipboard entry', async () => {
      const entry = {
        content: 'Test content',
        contentType: 'text',
        format: 'text' as const,
        preview: 'Test content',
        appName: 'TestApp',
        isPinned: false,
        isFavorite: false,
        category: 'Text',
        tags: [],
        usageCount: 0,
      };

      const result = await storageManager.addClipboardEntry(entry);

      expect(result).toMatchObject({
        ...entry,
        id: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(storageManager.getClipboardEntryCount()).toBe(1);
    });

    it('should enforce history limit for non-pinned items', async () => {
      const maxItems = 20; // Use minimum limit that will be enforced

      // Add 22 non-pinned items - should trigger limit enforcement
      for (let i = 0; i < 22; i++) {
        await storageManager.addClipboardEntry(
          {
            content: `Content ${i}`,
            contentType: 'text',
            format: 'text' as const,
            preview: `Content ${i}`,
            appName: 'TestApp',
            isPinned: false,
            isFavorite: false,
            category: 'Text',
            tags: [],
            usageCount: 0,
          },
          maxItems
        );
      }

      // Should have exactly maxItems non-pinned entries
      expect(storageManager.getNonPinnedEntryCount()).toBe(maxItems);
      expect(storageManager.getClipboardEntryCount()).toBe(maxItems);
    });

    it('should not delete pinned items when enforcing limit', async () => {
      const maxItems = 20;

      // Add a pinned item first
      await storageManager.addClipboardEntry(
        {
          content: 'Pinned content',
          contentType: 'text',
          format: 'text' as const,
          preview: 'Pinned content',
          appName: 'TestApp',
          isPinned: true,
          isFavorite: false,
          category: 'Text',
          tags: [],
          usageCount: 0,
        },
        maxItems
      );

      // Add 22 non-pinned items - should trigger limit enforcement
      for (let i = 0; i < 22; i++) {
        await storageManager.addClipboardEntry(
          {
            content: `Content ${i}`,
            contentType: 'text',
            format: 'text' as const,
            preview: `Content ${i}`,
            appName: 'TestApp',
            isPinned: false,
            isFavorite: false,
            category: 'Text',
            tags: [],
            usageCount: 0,
          },
          maxItems
        );
      }

      expect(storageManager.getPinnedEntryCount()).toBe(1);
      expect(storageManager.getNonPinnedEntryCount()).toBe(maxItems);
      expect(storageManager.getClipboardEntryCount()).toBe(21); // 1 pinned + 20 non-pinned
    });
  });

  describe('getClipboardHistory', () => {
    beforeEach(async () => {
      // Add test data
      await storageManager.addClipboardEntry({
        content: 'Pinned item',
        contentType: 'text',
        format: 'text' as const,
        preview: 'Pinned item',
        appName: 'TestApp',
        isPinned: true,
        isFavorite: false,
        category: 'Text',
        tags: [],
        usageCount: 0,
      });

      await storageManager.addClipboardEntry({
        content: 'Regular item 1',
        contentType: 'text',
        format: 'text' as const,
        preview: 'Regular item 1',
        appName: 'TestApp',
        isPinned: false,
        isFavorite: false,
        category: 'Text',
        tags: [],
        usageCount: 0,
      });

      await storageManager.addClipboardEntry({
        content: 'Regular item 2',
        contentType: 'text',
        format: 'text' as const,
        preview: 'Regular item 2',
        appName: 'TestApp',
        isPinned: false,
        isFavorite: false,
        category: 'Text',
        tags: [],
        usageCount: 0,
      });
    });

    it('should return all pinned items plus limited non-pinned items', async () => {
      const result = await storageManager.getClipboardHistory({ limit: 1 });

      expect(result).toHaveLength(2); // 1 pinned + 1 non-pinned
      expect(result[0].isPinned).toBe(true);
      expect(result[1].isPinned).toBe(false);
    });

    it('should filter by search query', async () => {
      const result = await storageManager.getClipboardHistory({
        searchQuery: 'Pinned',
      });

      expect(result).toHaveLength(1);
      expect(result[0].content).toBe('Pinned item');
    });

    it('should filter by category', async () => {
      const result = await storageManager.getClipboardHistory({
        category: 'Text',
      });

      expect(result).toHaveLength(3);
    });
  });

  describe('pinClipboardEntry', () => {
    beforeEach(() => {
      storageManager = new JsonStorageManager();
    });

    it('should toggle pin status of an entry', async () => {
      const entry = await storageManager.addClipboardEntry({
        content: 'Test content',
        contentType: 'text',
        format: 'text' as const,
        preview: 'Test content',
        appName: 'TestApp',
        isPinned: false,
        isFavorite: false,
        category: 'Text',
        tags: [],
        usageCount: 0,
      });

      const pinnedEntry = await storageManager.pinClipboardEntry(entry.id);
      expect(pinnedEntry?.isPinned).toBe(true);

      const unpinnedEntry = await storageManager.pinClipboardEntry(entry.id);
      expect(unpinnedEntry?.isPinned).toBe(false);
    });
  });

  describe('deleteClipboardEntry', () => {
    beforeEach(() => {
      storageManager = new JsonStorageManager();
    });

    it('should delete an entry by id', async () => {
      const entry = await storageManager.addClipboardEntry({
        content: 'Test content',
        contentType: 'text',
        format: 'text' as const,
        preview: 'Test content',
        appName: 'TestApp',
        isPinned: false,
        isFavorite: false,
        category: 'Text',
        tags: [],
        usageCount: 0,
      });

      const deleted = await storageManager.deleteClipboardEntry(entry.id);
      expect(deleted).toBe(true);
      expect(storageManager.getClipboardEntryCount()).toBe(0);
    });
  });

  describe('clearClipboardHistory', () => {
    beforeEach(() => {
      storageManager = new JsonStorageManager();
    });

    it('should clear all non-pinned entries', async () => {
      // Add pinned and non-pinned entries
      await storageManager.addClipboardEntry({
        content: 'Pinned',
        contentType: 'text',
        format: 'text' as const,
        preview: 'Pinned',
        appName: 'TestApp',
        isPinned: true,
        isFavorite: false,
        category: 'Text',
        tags: [],
        usageCount: 0,
      });

      await storageManager.addClipboardEntry({
        content: 'Not pinned',
        contentType: 'text',
        format: 'text' as const,
        preview: 'Not pinned',
        appName: 'TestApp',
        isPinned: false,
        isFavorite: false,
        category: 'Text',
        tags: [],
        usageCount: 0,
      });

      const cleared = await storageManager.clearClipboardHistory();
      expect(cleared).toBe(true);
      expect(storageManager.getPinnedEntryCount()).toBe(1);
      expect(storageManager.getNonPinnedEntryCount()).toBe(0);
    });
  });
});
