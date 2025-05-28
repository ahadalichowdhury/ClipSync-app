import React, { useEffect, useRef } from 'react';
import { ClipboardEntry } from '../../../shared/types';
import { ClipboardEntryCard } from './ClipboardEntryCard';

interface ClipboardHistoryProps {
  entries: ClipboardEntry[];
  onDeleteEntry: (id: number) => void;
  onPinEntry: (id: number) => void;
  onCopyToClipboard: (entry: ClipboardEntry) => void;
  onUpdateNote: (id: number, note: string) => void;
  selectedIndex?: number;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
}

export const ClipboardHistory: React.FC<ClipboardHistoryProps> = ({
  entries,
  onDeleteEntry,
  onPinEntry,
  onCopyToClipboard,
  onUpdateNote,
  selectedIndex = -1,
  scrollContainerRef,
}) => {
  const selectedItemRef = useRef<HTMLDivElement>(null);

  // Separate pinned and unpinned entries
  const pinnedEntries = entries.filter(entry => entry.isPinned);
  const unpinnedEntries = entries.filter(entry => !entry.isPinned);

  // Auto-scroll to selected item with improved smoothness
  useEffect(() => {
    if (selectedIndex >= 0 && selectedItemRef.current) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        if (selectedItemRef.current) {
          selectedItemRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center', // Center the item in view for better visibility
            inline: 'nearest',
          });
        }
      });
    }
  }, [selectedIndex]);

  return (
    <div className="space-y-4 h-full overflow-y-auto scroll-smooth">
      {/* Pinned entries section */}
      {pinnedEntries.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2 flex items-center">
            📌 Pinned ({pinnedEntries.length})
          </h3>
          <div className="space-y-2">
            {pinnedEntries.map((entry, index) => (
              <div
                key={entry.id}
                ref={index === selectedIndex ? selectedItemRef : null}
              >
                <ClipboardEntryCard
                  entry={entry}
                  onDelete={onDeleteEntry}
                  onPin={onPinEntry}
                  onCopy={onCopyToClipboard}
                  onUpdateNote={onUpdateNote}
                  isSelected={index === selectedIndex}
                  dataIndex={index}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent entries section */}
      {unpinnedEntries.length > 0 && (
        <div>
          {pinnedEntries.length > 0 && (
            <h3 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
              Recent ({unpinnedEntries.length})
            </h3>
          )}
          <div className="space-y-2">
            {unpinnedEntries.map((entry, index) => {
              const globalIndex = pinnedEntries.length + index;
              return (
                <div
                  key={entry.id}
                  ref={globalIndex === selectedIndex ? selectedItemRef : null}
                >
                  <ClipboardEntryCard
                    entry={entry}
                    onDelete={onDeleteEntry}
                    onPin={onPinEntry}
                    onCopy={onCopyToClipboard}
                    onUpdateNote={onUpdateNote}
                    isSelected={globalIndex === selectedIndex}
                    dataIndex={globalIndex}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
