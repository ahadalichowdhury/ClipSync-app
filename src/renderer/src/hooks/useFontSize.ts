import { useEffect, useState } from 'react';

export function useFontSize() {
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>(
    'medium'
  );

  useEffect(() => {
    loadFontSize();
  }, []);

  const loadFontSize = async () => {
    try {
      if (window.electronAPI?.settings?.get) {
        const fontSizeSetting =
          await window.electronAPI.settings.get('fontSize');
        if (fontSizeSetting) {
          applyFontSize(fontSizeSetting);
        }
      }
    } catch (error) {
      console.error('Failed to load font size setting:', error);
    }
  };

  const applyFontSize = (size: 'small' | 'medium' | 'large') => {
    const root = document.documentElement;

    // Remove existing font size classes
    root.classList.remove(
      'font-size-small',
      'font-size-medium',
      'font-size-large'
    );

    // Add new font size class
    root.classList.add(`font-size-${size}`);

    setFontSize(size);
  };

  const updateFontSize = async (newSize: 'small' | 'medium' | 'large') => {
    try {
      if (window.electronAPI?.settings?.set) {
        await window.electronAPI.settings.set('fontSize', newSize);
        applyFontSize(newSize);
      }
    } catch (error) {
      console.error('Failed to update font size:', error);
    }
  };

  return {
    fontSize,
    updateFontSize,
    refreshFontSize: loadFontSize,
  };
}
