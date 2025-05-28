import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ClipboardEntryCard } from '../ClipboardEntryCard';
import { ClipboardEntry } from '../../../../shared/types';

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock document.createElement and appendChild/removeChild
const mockLink = {
  href: '',
  download: '',
  click: jest.fn(),
};
const originalCreateElement = document.createElement;
document.createElement = jest.fn((tagName) => {
  if (tagName === 'a') {
    return mockLink as any;
  }
  return originalCreateElement.call(document, tagName);
});

const mockAppendChild = jest.fn();
const mockRemoveChild = jest.fn();
document.body.appendChild = mockAppendChild;
document.body.removeChild = mockRemoveChild;

describe('ClipboardEntryCard', () => {
  const mockOnDelete = jest.fn();
  const mockOnPin = jest.fn();
  const mockOnCopy = jest.fn();
  const mockOnUpdateNote = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockEntry = (overrides: Partial<ClipboardEntry> = {}): ClipboardEntry => ({
    id: 1,
    content: 'Test content',
    contentType: 'text',
    format: 'text',
    preview: 'Test content',
    appName: 'Test App',
    isPinned: false,
    isFavorite: false,
    category: 'Text',
    tags: [],
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  });

  describe('Rich Text Support', () => {
    it('should display HTML rich text with proper category icon', () => {
      const htmlEntry = createMockEntry({
        format: 'html',
        category: 'Rich Text',
        content: '<p><strong>Bold text</strong> with <em>italic</em></p>',
        preview: 'Bold text with italic',
      });

      render(
        <ClipboardEntryCard
          entry={htmlEntry}
          onDelete={mockOnDelete}
          onPin={mockOnPin}
          onCopy={mockOnCopy}
          onUpdateNote={mockOnUpdateNote}
        />
      );

      expect(screen.getByText('📄✨')).toBeInTheDocument();
      expect(screen.getByText('Rich Text')).toBeInTheDocument();
      expect(screen.getByText('Bold text with italic')).toBeInTheDocument();
    });

    it('should display RTF rich text with proper category icon', () => {
      const rtfEntry = createMockEntry({
        format: 'rtf',
        category: 'Rich Text',
        content: '{\\rtf1\\ansi\\b Bold text\\b0}',
        preview: 'Bold text',
      });

      render(
        <ClipboardEntryCard
          entry={rtfEntry}
          onDelete={mockOnDelete}
          onPin={mockOnPin}
          onCopy={mockOnCopy}
          onUpdateNote={mockOnUpdateNote}
        />
      );

      expect(screen.getByText('📄✨')).toBeInTheDocument();
      expect(screen.getByText('Rich Text')).toBeInTheDocument();
      expect(screen.getByText('Bold text')).toBeInTheDocument();
    });

    it('should display image content with preview', () => {
      const imageEntry = createMockEntry({
        format: 'image',
        category: 'Images',
        content: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
      });

      render(
        <ClipboardEntryCard
          entry={imageEntry}
          onDelete={mockOnDelete}
          onPin={mockOnPin}
          onCopy={mockOnCopy}
          onUpdateNote={mockOnUpdateNote}
        />
      );

      expect(screen.getByText('🖼️')).toBeInTheDocument();
      expect(screen.getByText('Images')).toBeInTheDocument();
      expect(screen.getByAltText('Clipboard image')).toBeInTheDocument();
    });
  });

  describe('Download Functionality', () => {
    it('should show download menu when three-dot button is clicked', async () => {
      const textEntry = createMockEntry();

      render(
        <ClipboardEntryCard
          entry={textEntry}
          onDelete={mockOnDelete}
          onPin={mockOnPin}
          onCopy={mockOnCopy}
          onUpdateNote={mockOnUpdateNote}
        />
      );

      const menuButton = screen.getByTitle('Download options');
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Download as Text')).toBeInTheDocument();
        expect(screen.getByText('Download as Docs')).toBeInTheDocument();
      });
    });

    it('should download HTML content with correct options', async () => {
      const htmlEntry = createMockEntry({
        format: 'html',
        category: 'Rich Text',
        content: '<p><strong>Bold text</strong></p>',
      });

      render(
        <ClipboardEntryCard
          entry={htmlEntry}
          onDelete={mockOnDelete}
          onPin={mockOnPin}
          onCopy={mockOnCopy}
          onUpdateNote={mockOnUpdateNote}
        />
      );

      const menuButton = screen.getByTitle('Download options');
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Download as HTML')).toBeInTheDocument();
        expect(screen.getByText('Download as Text')).toBeInTheDocument();
      });
    });

    it('should download RTF content with text option only', async () => {
      const rtfEntry = createMockEntry({
        format: 'rtf',
        category: 'Rich Text',
        content: '{\\rtf1\\ansi\\b Bold text\\b0}',
      });

      render(
        <ClipboardEntryCard
          entry={rtfEntry}
          onDelete={mockOnDelete}
          onPin={mockOnPin}
          onCopy={mockOnCopy}
          onUpdateNote={mockOnUpdateNote}
        />
      );

      const menuButton = screen.getByTitle('Download options');
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Download as Text')).toBeInTheDocument();
        expect(screen.queryByText('Download as RTF')).not.toBeInTheDocument();
      });
    });

    it('should download image with PNG and JPG options', async () => {
      const imageEntry = createMockEntry({
        format: 'image',
        category: 'Images',
        content: 'data:image/png;base64,test',
      });

      render(
        <ClipboardEntryCard
          entry={imageEntry}
          onDelete={mockOnDelete}
          onPin={mockOnPin}
          onCopy={mockOnCopy}
          onUpdateNote={mockOnUpdateNote}
        />
      );

      const menuButton = screen.getByTitle('Download options');
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Download as PNG')).toBeInTheDocument();
        expect(screen.getByText('Download as JPG')).toBeInTheDocument();
      });
    });

    it('should download code content with JSON and text options', async () => {
      const codeEntry = createMockEntry({
        category: 'Code',
        content: '{"key": "value"}',
      });

      render(
        <ClipboardEntryCard
          entry={codeEntry}
          onDelete={mockOnDelete}
          onPin={mockOnPin}
          onCopy={mockOnCopy}
          onUpdateNote={mockOnUpdateNote}
        />
      );

      const menuButton = screen.getByTitle('Download options');
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Download as JSON')).toBeInTheDocument();
        expect(screen.getByText('Download as Text')).toBeInTheDocument();
      });
    });

    it('should download URL content with text and HTML link options', async () => {
      const urlEntry = createMockEntry({
        category: 'URLs',
        content: 'https://example.com',
      });

      render(
        <ClipboardEntryCard
          entry={urlEntry}
          onDelete={mockOnDelete}
          onPin={mockOnPin}
          onCopy={mockOnCopy}
          onUpdateNote={mockOnUpdateNote}
        />
      );

      const menuButton = screen.getByTitle('Download options');
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Download as Text')).toBeInTheDocument();
        expect(screen.getByText('Download as HTML Link')).toBeInTheDocument();
      });
    });
  });

  describe('Text Extraction', () => {
    it('should extract clean text from HTML content', () => {
      const htmlEntry = createMockEntry({
        format: 'html',
        content: '<p>Simple <strong>bold</strong> text</p><style>body{color:red}</style>',
      });

      render(
        <ClipboardEntryCard
          entry={htmlEntry}
          onDelete={mockOnDelete}
          onPin={mockOnPin}
          onCopy={mockOnCopy}
          onUpdateNote={mockOnUpdateNote}
        />
      );

      const menuButton = screen.getByTitle('Download options');
      fireEvent.click(menuButton);

      const textDownloadButton = screen.getByText('Download as Text');
      fireEvent.click(textDownloadButton);

      expect(mockLink.click).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalled();
    });

    it('should extract clean text from RTF content', () => {
      const rtfEntry = createMockEntry({
        format: 'rtf',
        content: '{\\rtf1\\ansi\\b Bold text\\b0}',
        preview: 'Bold text',
      });

      render(
        <ClipboardEntryCard
          entry={rtfEntry}
          onDelete={mockOnDelete}
          onPin={mockOnPin}
          onCopy={mockOnCopy}
          onUpdateNote={mockOnUpdateNote}
        />
      );

      const menuButton = screen.getByTitle('Download options');
      fireEvent.click(menuButton);

      const textDownloadButton = screen.getByText('Download as Text');
      fireEvent.click(textDownloadButton);

      expect(mockLink.click).toHaveBeenCalled();
    });
  });

  describe('Menu Interaction', () => {
    it('should close menu when clicking outside', async () => {
      const textEntry = createMockEntry();

      render(
        <ClipboardEntryCard
          entry={textEntry}
          onDelete={mockOnDelete}
          onPin={mockOnPin}
          onCopy={mockOnCopy}
          onUpdateNote={mockOnUpdateNote}
        />
      );

      const menuButton = screen.getByTitle('Download options');
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Download as Text')).toBeInTheDocument();
      });

      // Simulate clicking outside
      fireEvent.mouseDown(document.body);

      await waitFor(() => {
        expect(screen.queryByText('Download as Text')).not.toBeInTheDocument();
      });
    });

    it('should close menu after download action', async () => {
      const textEntry = createMockEntry();

      render(
        <ClipboardEntryCard
          entry={textEntry}
          onDelete={mockOnDelete}
          onPin={mockOnPin}
          onCopy={mockOnCopy}
          onUpdateNote={mockOnUpdateNote}
        />
      );

      const menuButton = screen.getByTitle('Download options');
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Download as Text')).toBeInTheDocument();
      });

      const textDownloadButton = screen.getByText('Download as Text');
      fireEvent.click(textDownloadButton);

      await waitFor(() => {
        expect(screen.queryByText('Download as Text')).not.toBeInTheDocument();
      });
    });
  });

  describe('Category Icons', () => {
    const categoryTests = [
      { category: 'Text', icon: '📝' },
      { category: 'Rich Text', icon: '📄✨' },
      { category: 'URLs', icon: '🔗' },
      { category: 'Images', icon: '🖼️' },
      { category: 'Files', icon: '📁' },
      { category: 'Code', icon: '💻' },
      { category: 'Email Addresses', icon: '📧' },
      { category: 'Phone Numbers', icon: '📞' },
      { category: undefined, icon: '📄' },
    ];

    categoryTests.forEach(({ category, icon }) => {
      it(`should display correct icon for ${category || 'undefined'} category`, () => {
        const entry = createMockEntry({ category });

        render(
          <ClipboardEntryCard
            entry={entry}
            onDelete={mockOnDelete}
            onPin={mockOnPin}
            onCopy={mockOnCopy}
            onUpdateNote={mockOnUpdateNote}
          />
        );

        expect(screen.getByText(icon)).toBeInTheDocument();
      });
    });
  });

  describe('Note Functionality', () => {
    it('should show note icon when entry has a note', () => {
      const entryWithNote = createMockEntry({
        note: 'This is a test note',
      });

      render(
        <ClipboardEntryCard
          entry={entryWithNote}
          onDelete={mockOnDelete}
          onPin={mockOnPin}
          onCopy={mockOnCopy}
          onUpdateNote={mockOnUpdateNote}
        />
      );

      expect(screen.getByTitle('Edit note')).toBeInTheDocument();
      expect(screen.getByText('📝 This is a test note')).toBeInTheDocument();
    });

    it('should show add note icon when entry has no note', () => {
      const entryWithoutNote = createMockEntry();

      render(
        <ClipboardEntryCard
          entry={entryWithoutNote}
          onDelete={mockOnDelete}
          onPin={mockOnPin}
          onCopy={mockOnCopy}
          onUpdateNote={mockOnUpdateNote}
        />
      );

      expect(screen.getByTitle('Add note')).toBeInTheDocument();
    });
  });

  describe('Pin Functionality', () => {
    it('should show pinned icon when entry is pinned', () => {
      const pinnedEntry = createMockEntry({
        isPinned: true,
      });

      render(
        <ClipboardEntryCard
          entry={pinnedEntry}
          onDelete={mockOnDelete}
          onPin={mockOnPin}
          onCopy={mockOnCopy}
          onUpdateNote={mockOnUpdateNote}
        />
      );

      expect(screen.getByText('📌')).toBeInTheDocument();
      expect(screen.getByTitle('Unpin')).toBeInTheDocument();
    });

    it('should show unpin icon when entry is not pinned', () => {
      const unpinnedEntry = createMockEntry({
        isPinned: false,
      });

      render(
        <ClipboardEntryCard
          entry={unpinnedEntry}
          onDelete={mockOnDelete}
          onPin={mockOnPin}
          onCopy={mockOnCopy}
          onUpdateNote={mockOnUpdateNote}
        />
      );

      expect(screen.getByTitle('Pin')).toBeInTheDocument();
    });
  });
}); 