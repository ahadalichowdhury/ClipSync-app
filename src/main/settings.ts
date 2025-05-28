import Store from 'electron-store';
import { DEFAULT_SETTINGS, Settings } from '../shared/types';

export class SettingsManager {
  private store: Store<Settings>;

  constructor() {
    try {
      console.log('Initializing settings store...');
      this.store = new Store<Settings>({
        defaults: DEFAULT_SETTINGS,
        name: 'clipsync-settings',
      });
      console.log('Settings store initialized successfully');
      console.log('Current settings:', this.store.store);
    } catch (error) {
      console.error('Failed to initialize settings store:', error);
      throw error;
    }
  }

  get<K extends keyof Settings>(
    key?: K
  ): K extends undefined ? Settings : Settings[K] {
    try {
      if (key === undefined) {
        return this.store.store as any;
      }
      return this.store.get(key) as any;
    } catch (error) {
      console.error(`Failed to get setting ${key}:`, error);
      throw error;
    }
  }

  set<K extends keyof Settings>(key: K, value: Settings[K]): void {
    try {
      console.log(`Setting ${key} to:`, value);
      this.store.set(key, value);
    } catch (error) {
      console.error(`Failed to set setting ${key}:`, error);
      throw error;
    }
  }

  getAll(): Settings {
    try {
      return this.store.store;
    } catch (error) {
      console.error('Failed to get all settings:', error);
      throw error;
    }
  }

  reset(): void {
    this.store.clear();
  }

  has<K extends keyof Settings>(key: K): boolean {
    return this.store.has(key);
  }

  delete<K extends keyof Settings>(key: K): void {
    this.store.delete(key);
  }

  // Get the file path where settings are stored
  getPath(): string {
    return this.store.path;
  }
}
