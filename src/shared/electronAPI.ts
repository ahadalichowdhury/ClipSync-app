import { ClipboardEntry, Settings } from './types';

export interface ElectronAPI {
  clipboard: {
    getHistory: (options?: any) => Promise<ClipboardEntry[]>;
    delete: (id: number) => Promise<boolean>;
    pin: (id: number) => Promise<ClipboardEntry | null>;
    updateNote: (id: number, note: string) => Promise<ClipboardEntry | null>;
    clear: () => Promise<boolean>;
    paste: (content: string) => Promise<boolean>;
    smartPaste: (content: string) => Promise<boolean>;
  };
  settings: {
    get: (key?: string) => Promise<any>;
    set: (key: string, value: any) => Promise<void>;
    getAll: () => Promise<Settings>;
  };
  window: {
    show: () => Promise<void>;
    hide: () => Promise<void>;
    toggle: () => Promise<void>;
    closeAbout: () => Promise<void>;
  };
  hotkey: {
    register: (hotkey: string) => Promise<boolean>;
    getCurrent: () => Promise<string>;
  };
  on: {
    clipboardChanged: (callback: (entry: ClipboardEntry) => void) => () => void;
    settingsChanged: (callback: () => void) => () => void;
  };
  utils: {
    getVersion: () => Promise<string>;
    getPlatform: () => string;
    isProduction: () => boolean;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
