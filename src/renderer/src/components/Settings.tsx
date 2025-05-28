import { useEffect, useState } from 'react';
import '../../../shared/electronAPI';
import { Settings as SettingsType } from '../../../shared/types';
import { useFontSize } from '../hooks/useFontSize';
import { useTheme } from '../hooks/useTheme';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [currentHotkey, setCurrentHotkey] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [tempHotkey, setTempHotkey] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string>('');

  // Use theme and font size hooks
  const { updateTheme, refreshSettings: refreshTheme } = useTheme();
  const { updateFontSize, refreshFontSize } = useFontSize();

  useEffect(() => {
    console.log('Settings component mounted, isOpen:', isOpen);
    if (isOpen) {
      loadSettings();
      // Get platform information
      if (window.electronAPI?.utils?.getPlatform) {
        setPlatform(window.electronAPI.utils.getPlatform());
      }
    }
  }, [isOpen]);

  const loadSettings = async () => {
    try {
      console.log('Loading settings...');
      setLoading(true);
      setError(null);

      // Check if electronAPI is available
      if (!window.electronAPI) {
        throw new Error('Electron API not available');
      }

      // Check if settings API is available
      if (!window.electronAPI.settings) {
        throw new Error('Settings API not available');
      }

      const [allSettings, hotkey] = await Promise.all([
        window.electronAPI.settings.getAll(),
        window.electronAPI.hotkey.getCurrent(),
      ]);

      console.log('Loaded settings:', allSettings);
      console.log('Loaded hotkey:', hotkey);

      if (!allSettings) {
        throw new Error('Failed to load settings');
      }

      setSettings(allSettings);
      setCurrentHotkey(hotkey || '');
    } catch (error) {
      console.error('Failed to load settings:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to load settings'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleHotkeyRecord = () => {
    setIsRecording(true);
    setTempHotkey('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isRecording) return;

    e.preventDefault();
    e.stopPropagation();

    const keys: string[] = [];
    const isMac = navigator.userAgent.includes('Mac');

    // Add modifiers in consistent order
    if (e.ctrlKey && !isMac) {
      keys.push('Control');
    }
    if (e.metaKey && isMac) {
      keys.push('Command');
    }
    if (e.altKey) {
      keys.push('Alt');
    }
    if (e.shiftKey) {
      keys.push('Shift');
    }

    // Handle main key (ignore modifier keys themselves)
    // Use e.code for physical key detection to avoid Alt+letter special characters
    const mainKey = e.code || e.key;
    const isModifierKey = [
      'Control',
      'Alt',
      'Shift',
      'Meta',
      'Command',
      'Cmd',
    ].includes(e.key);

    if (!isModifierKey) {
      // Handle letter keys using e.code (KeyA, KeyB, etc.)
      if (mainKey.startsWith('Key') && mainKey.length === 4) {
        const letter = mainKey.slice(3); // Extract 'A' from 'KeyA'
        keys.push(letter);
      }
      // Handle digit keys using e.code (Digit1, Digit2, etc.)
      else if (mainKey.startsWith('Digit') && mainKey.length === 6) {
        const digit = mainKey.slice(5); // Extract '1' from 'Digit1'
        keys.push(digit);
      }
      // Handle function keys (F1-F12)
      else if (mainKey.startsWith('F') && /^F\d{1,2}$/.test(mainKey)) {
        keys.push(mainKey);
      }
      // Handle special keys
      else {
        const specialKeyMap: { [key: string]: string } = {
          Space: 'Space',
          ArrowUp: 'Up',
          ArrowDown: 'Down',
          ArrowLeft: 'Left',
          ArrowRight: 'Right',
          Escape: 'Esc',
          Delete: 'Delete',
          Backspace: 'Backspace',
          Tab: 'Tab',
          Enter: 'Return',
          Minus: '-',
          Equal: '=',
          BracketLeft: '[',
          BracketRight: ']',
          Backslash: '\\',
          Semicolon: ';',
          Quote: "'",
          Comma: ',',
          Period: '.',
          Slash: '/',
          Backquote: '`',
        };

        if (specialKeyMap[mainKey]) {
          keys.push(specialKeyMap[mainKey]);
        } else if (e.key.length === 1 && /^[a-zA-Z0-9]$/.test(e.key)) {
          // Fallback for simple ASCII characters
          keys.push(e.key.toUpperCase());
        }
      }
    }

    // Only show hotkey if we have at least one modifier + one main key
    if (keys.length >= 2) {
      const hotkeyString = keys.join('+');
      console.log('Detected keys:', keys, 'Hotkey string:', hotkeyString);
      setTempHotkey(hotkeyString);
    } else if (keys.length === 1 && !isModifierKey) {
      // Show single key for feedback, but it won't be valid
      setTempHotkey(keys[0] + ' (needs modifier)');
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (!isRecording) return;

    // Stop recording when all keys are released and we have a valid hotkey
    if (
      !e.ctrlKey &&
      !e.altKey &&
      !e.shiftKey &&
      !e.metaKey &&
      tempHotkey &&
      !tempHotkey.includes('(needs modifier)')
    ) {
      setIsRecording(false);
    }
  };

  const applyHotkey = async () => {
    if (!tempHotkey || tempHotkey.includes('(needs modifier)')) return;

    try {
      // Convert to Electron format by processing each part separately
      const parts = tempHotkey.split('+');
      const convertedParts = parts.map(part => {
        if (part === 'Command' || part === 'Control') {
          return 'CommandOrControl';
        }
        return part;
      });

      const electronHotkey = convertedParts.join('+');

      // Validate that we have at least one modifier and a main key
      const modifiers = convertedParts.filter(part =>
        ['CommandOrControl', 'Alt', 'Shift'].includes(part)
      );
      const mainKeys = convertedParts.filter(
        part => !['CommandOrControl', 'Alt', 'Shift'].includes(part)
      );

      if (modifiers.length === 0) {
        console.error(
          'Hotkey must include at least one modifier (Cmd/Ctrl, Alt, or Shift)'
        );
        alert(
          'Hotkey must include at least one modifier key (Cmd/Ctrl, Alt, or Shift) for security reasons.'
        );
        return;
      }

      if (mainKeys.length === 0) {
        console.error('Hotkey must include a main key');
        alert(
          'Hotkey must include a main key (letter, number, or function key).'
        );
        return;
      }

      console.log('Original hotkey:', tempHotkey);
      console.log('Converted hotkey:', electronHotkey);

      const success = await window.electronAPI.hotkey.register(electronHotkey);
      if (success) {
        await window.electronAPI.settings.set('globalHotkey', electronHotkey);
        setCurrentHotkey(electronHotkey);
        setTempHotkey('');
        console.log('Hotkey updated successfully:', electronHotkey);
      } else {
        console.error('Failed to register hotkey:', electronHotkey);
        alert(
          'Failed to register hotkey. It might be already in use by another application.'
        );
      }
    } catch (error) {
      console.error('Failed to update hotkey:', error);
      alert('Failed to update hotkey: ' + error);
    }
  };

  const cancelHotkeyRecord = () => {
    setIsRecording(false);
    setTempHotkey('');
  };

  const updateSetting = async (key: keyof SettingsType, value: any) => {
    try {
      await window.electronAPI.settings.set(key, value);
      setSettings(prev => (prev ? { ...prev, [key]: value } : null));

      // Handle special settings that need immediate application
      if (key === 'theme') {
        await updateTheme(value);
        await refreshTheme();
      } else if (key === 'fontSize') {
        await updateFontSize(value);
        await refreshFontSize();
      }
    } catch (error) {
      console.error('Failed to update setting:', error);
    }
  };

  if (!isOpen) {
    console.log('Settings not open, returning null');
    return null;
  }

  console.log(
    'Rendering settings component, loading:',
    loading,
    'settings:',
    settings,
    'error:',
    error
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-light-border dark:border-dark-border">
          <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="text-light-text-secondary dark:text-dark-text-secondary">
              Loading settings...
            </div>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <button
              onClick={loadSettings}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : !settings ? (
          <div className="p-6 text-center">
            <div className="text-red-500">
              Failed to load settings. Please try again.
            </div>
            <button
              onClick={loadSettings}
              className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Global Hotkey Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary">
                Global Hotkey
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Press this key combination from anywhere to open ClipSync.
                  Click "Change" and then press your desired key combination.
                  <br />
                  <strong>Note:</strong> Must include at least one modifier
                  (Cmd/Ctrl, Alt, or Shift) + a main key for security.
                </p>

                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div
                      className={`
                        px-4 py-3 border rounded-md text-center font-mono
                        ${
                          isRecording
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-light-border dark:border-dark-border bg-light-bg-secondary dark:bg-dark-bg-secondary'
                        }
                      `}
                      onKeyDown={handleKeyDown}
                      onKeyUp={handleKeyUp}
                      tabIndex={0}
                    >
                      {isRecording ? (
                        <span className="text-primary-600 dark:text-primary-400">
                          {tempHotkey || 'Press keys...'}
                        </span>
                      ) : tempHotkey &&
                        !tempHotkey.includes('(needs modifier)') ? (
                        <span className="text-orange-600 dark:text-orange-400">
                          {tempHotkey} (not saved)
                        </span>
                      ) : (
                        <span className="text-light-text-primary dark:text-dark-text-primary">
                          {currentHotkey || 'No hotkey set'}
                        </span>
                      )}
                    </div>
                  </div>

                  {isRecording ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={cancelHotkeyRecord}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : tempHotkey && !tempHotkey.includes('(needs modifier)') ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={applyHotkey}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelHotkeyRecord}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleHotkeyRecord}
                      className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                    >
                      Change
                    </button>
                  )}
                </div>

                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  {isRecording ? (
                    'Press your desired key combination...'
                  ) : tempHotkey && !tempHotkey.includes('(needs modifier)') ? (
                    'Click "Save" to apply the new hotkey or "Cancel" to discard.'
                  ) : (
                    <>
                      Valid examples: Cmd+V, Ctrl+Shift+C, Alt+F1, Shift+Space
                      {currentHotkey && (
                        <>
                          <br />
                          Current:{' '}
                          <span className="font-mono">{currentHotkey}</span>
                        </>
                      )}
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* General Settings */}
            {settings && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary">
                  General
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                        Auto-start with system
                      </label>
                      <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        Launch ClipSync when your computer starts
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.autoStart}
                      onChange={e =>
                        updateSetting('autoStart', e.target.checked)
                      }
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                        Monitor clipboard
                      </label>
                      <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        Automatically save copied content to history
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.monitorClipboard}
                      onChange={e =>
                        updateSetting('monitorClipboard', e.target.checked)
                      }
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                        Smart categorization
                      </label>
                      <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        Automatically categorize clipboard entries
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.autoCategories}
                      onChange={e =>
                        updateSetting('autoCategories', e.target.checked)
                      }
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      Maximum history items: {settings.maxHistoryItems}
                    </label>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                      When limit is reached, oldest items are automatically
                      removed (FIFO)
                    </p>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      step="5"
                      value={settings.maxHistoryItems}
                      onChange={e =>
                        updateSetting(
                          'maxHistoryItems',
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-light-text-secondary dark:text-dark-text-secondary">
                      <span>20</span>
                      <span>40 (default)</span>
                      <span>100</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                        Hide from dock
                      </label>
                      <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        {platform === 'darwin'
                          ? 'Hide from dock and show in menu bar'
                          : 'Show in system tray instead of dock'}
                      </p>
                      {platform === 'darwin' && (
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                          When hidden, the app will be accessible from the menu
                          bar icon
                        </p>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.hideFromDock}
                      onChange={e =>
                        updateSetting('hideFromDock', e.target.checked)
                      }
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Theme Settings */}
            {settings && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary">
                  Appearance
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      Theme
                    </label>
                    <select
                      value={settings.theme}
                      onChange={e => updateSetting('theme', e.target.value)}
                      className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (System)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      Font size
                    </label>
                    <select
                      value={settings.fontSize}
                      onChange={e => updateSetting('fontSize', e.target.value)}
                      className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-light-border dark:border-dark-border">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
