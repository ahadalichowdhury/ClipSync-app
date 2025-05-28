import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { isDev } from '../shared/constants';
import { ClipboardEntry, GetHistoryOptions, Settings } from '../shared/types';

// Define the API that will be exposed to the renderer process
const electronAPI = {
  // Window management
  window: {
    show: () => ipcRenderer.invoke('window:show'),
    hide: () => ipcRenderer.invoke('window:hide'),
    toggle: () => ipcRenderer.invoke('window:toggle'),
    closeAbout: () => ipcRenderer.invoke('window:closeAbout'),
  },

  // Clipboard operations
  clipboard: {
    getHistory: (options?: GetHistoryOptions) =>
      ipcRenderer.invoke('clipboard:getHistory', options),
    add: (entry: Omit<ClipboardEntry, 'id' | 'createdAt' | 'updatedAt'>) =>
      ipcRenderer.invoke('clipboard:add', entry),
    delete: (id: number) => ipcRenderer.invoke('clipboard:delete', id),
    pin: (id: number) => ipcRenderer.invoke('clipboard:pin', id),
    updateNote: (id: number, note: string) =>
      ipcRenderer.invoke('clipboard:updateNote', id, note),
    clear: () => ipcRenderer.invoke('clipboard:clear'),
    paste: (entry: ClipboardEntry) =>
      ipcRenderer.invoke('clipboard:paste', entry),
    smartPaste: (entry: ClipboardEntry) =>
      ipcRenderer.invoke('clipboard:smartPaste', entry),
  },

  // Settings management
  settings: {
    get: <K extends keyof Settings>(key?: K) =>
      ipcRenderer.invoke('settings:get', key),
    set: <K extends keyof Settings>(key: K, value: Settings[K]) =>
      ipcRenderer.invoke('settings:set', key, value),
    getAll: () => ipcRenderer.invoke('settings:getAll'),
  },

  // Event listeners
  on: {
    clipboardChanged: (callback: (entry: ClipboardEntry) => void) => {
      const subscription = (_event: IpcRendererEvent, entry: ClipboardEntry) =>
        callback(entry);
      ipcRenderer.on('clipboard:changed', subscription);

      // Return unsubscribe function
      return () =>
        ipcRenderer.removeListener('clipboard:changed', subscription);
    },

    settingsChanged: (callback: () => void) => {
      const subscription = (_event: IpcRendererEvent) => callback();
      ipcRenderer.on('show-settings', subscription);

      // Return unsubscribe function
      return () => ipcRenderer.removeListener('show-settings', subscription);
    },
  },

  // Hotkey management
  hotkey: {
    register: (hotkey: string) => ipcRenderer.invoke('hotkey:register', hotkey),
    getCurrent: () => ipcRenderer.invoke('hotkey:getCurrent'),
  },

  // Utility functions
  utils: {
    getVersion: () => ipcRenderer.invoke('utils:getVersion'),
    getPlatform: () => process.platform,
    isProduction: () => !isDev,
  },
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Type declaration for the exposed API
export type ElectronAPI = typeof electronAPI;
