import React from 'react';

interface HeaderProps {
  onClearHistory: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onClearHistory,
  onOpenSettings,
}) => {
  return (
    <header className="bg-light-bg-secondary dark:bg-dark-bg-secondary border-b border-light-border dark:border-dark-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CS</span>
          </div>
          <h1 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
            ClipSync
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onClearHistory}
            className="px-3 py-1.5 text-sm bg-light-bg-tertiary dark:bg-dark-bg-tertiary hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            title="Clear History"
          >
            Clear
          </button>

          <button
            onClick={onOpenSettings}
            className="px-3 py-1.5 text-sm bg-light-bg-tertiary dark:bg-dark-bg-tertiary hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            title="Settings"
          >
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
};
