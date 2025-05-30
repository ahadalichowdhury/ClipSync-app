import { Clipboard } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AboutProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
}

export function About({ isOpen, onClose }: AboutProps) {
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
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clipboard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
            LocalClip
          </h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Version {appVersion}
          </p>
        </div>

        {/* Description */}
        <div className="space-y-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
          <p>
            A modern, Windows 11-inspired clipboard manager with local storage
            and privacy-first design.
          </p>

          <div className="bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-lg p-4">
            <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
              Quick Start
            </h3>
            <p className="mb-2">
              Press{' '}
              <kbd className="px-2 py-1 bg-light-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded text-xs">
                Ctrl+Shift+V
              </kbd>{' '}
              (or{' '}
              <kbd className="px-2 py-1 bg-light-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded text-xs">
                Cmd+Shift+V
              </kbd>{' '}
              on Mac) from anywhere to open LocalClip
            </p>
          </div>

          <div className="text-center pt-4 border-t border-light-border dark:border-dark-border">
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
              Built with ❤️ by S. M. Ahad Ali Chowdhury
            </p>
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
              © 2024 LocalClip. All rights reserved.
            </p>
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
            from anywhere to open LocalClip
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
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
          >
            LocalClip will now run in the background
          </button>
        </div>
      </div>
    </div>
  );
}
