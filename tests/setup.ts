import '@testing-library/jest-dom';

// Mock Electron APIs
const mockElectronAPI = {
  clipboard: {
    getHistory: jest.fn(),
    delete: jest.fn(),
    pin: jest.fn(),
    updateNote: jest.fn(),
    clear: jest.fn(),
    paste: jest.fn(),
    smartPaste: jest.fn(),
  },
  settings: {
    get: jest.fn(),
    set: jest.fn(),
    getAll: jest.fn(),
  },
  window: {
    show: jest.fn(),
    hide: jest.fn(),
    toggle: jest.fn(),
    closeAbout: jest.fn(),
  },
  hotkey: {
    register: jest.fn(),
    getCurrent: jest.fn(),
  },
  on: {
    clipboardChanged: jest.fn(),
    settingsChanged: jest.fn(),
  },
  utils: {
    getVersion: jest.fn(),
    getPlatform: jest.fn(),
    isProduction: jest.fn(),
  },
};

// Mock window.electronAPI
Object.defineProperty(window, 'electronAPI', {
  value: mockElectronAPI,
  writable: true,
});

// Mock useTheme hook
jest.mock('../src/renderer/src/hooks/useTheme', () => ({
  useTheme: jest.fn(() => ({
    theme: 'light',
    settings: { theme: 'light' },
    updateTheme: jest.fn(),
    refreshSettings: jest.fn(),
  })),
}));

// Mock useFontSize hook
jest.mock('../src/renderer/src/hooks/useFontSize', () => ({
  useFontSize: jest.fn(() => ({
    fontSize: 'medium',
    updateFontSize: jest.fn(),
    refreshFontSize: jest.fn(),
  })),
}));

// Mock DOM methods that are not available in jsdom
Element.prototype.scrollIntoView = jest.fn();

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Suppress console warnings in tests
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('React Router Future Flag Warning')
  ) {
    return;
  }
  originalConsoleWarn(...args);
};
