import { useEffect, useState } from 'react';

interface AboutProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
}

export function About({ isOpen, onClose, onOpenSettings }: AboutProps) {
  const [appVersion, setAppVersion] = useState('1.0.0');

  useEffect(() => {
    console.log('About component mounted, isOpen:', isOpen);
    // Get app version from electron
    if (window.electronAPI) {
      // We'll add this API later
    }
  }, [isOpen]);

  console.log('About component render, isOpen:', isOpen);

  if (!isOpen) {
    console.log('About component not open, returning null');
    return null;
  }

  return (
    <div className="h-full overflow-y-auto bg-light-bg-primary dark:bg-dark-bg-primary">
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-xl w-full h-full p-6 overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
            ClipSync
          </h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Version {appVersion}
          </p>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-light-text-primary dark:text-dark-text-primary mb-4">
            A powerful clipboard manager inspired by Windows 11, designed for
            macOS and Linux.
          </p>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Smart clipboard monitoring and categorization
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Customizable global hotkeys
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Pin important clips and search history
              </span>
            </div>
          </div>
        </div>

        {/* Hotkey Info */}
        <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
            Quick Start
          </h3>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
            Press{' '}
            <kbd className="px-2 py-1 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded text-xs font-mono">
              Cmd+Shift+V
            </kbd>{' '}
            from anywhere to open ClipSync
          </p>
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
            You can customize this hotkey in Settings
          </p>
        </div>

        {/* Actions */}
        {/* <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Get Started
          </button>
          <button
            onClick={() => {
              onClose();
              if (onOpenSettings) {
                onOpenSettings();
              }
            }}
            className="px-4 py-2 border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-md hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors"
          >
            Settings
          </button>
        </div> */}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-light-border dark:border-dark-border text-center">
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
            ClipSync will now run in the background
          </p>
        </div>
      </div>
    </div>
  );
}
