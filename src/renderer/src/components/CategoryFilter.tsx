import React from 'react';
import { ClipboardEntry } from '../../../shared/types';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  entries: ClipboardEntry[];
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  entries,
}) => {
  // Get unique categories from entries
  const categories = React.useMemo(() => {
    const categorySet = new Set<string>();
    entries.forEach(entry => {
      if (entry.category) {
        categorySet.add(entry.category);
      }
    });
    return Array.from(categorySet).sort();
  }, [entries]);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'text':
        return '📝';
      case 'rich text':
        return '📄✨';
      case 'urls':
        return '🔗';
      case 'images':
        return '🖼️';
      case 'files':
        return '📁';
      case 'code':
        return '💻';
      case 'email addresses':
        return '📧';
      case 'phone numbers':
        return '📞';
      default:
        return '📄';
    }
  };

  const getCategoryCount = (category: string) => {
    if (category === 'all') {
      return entries.length;
    }
    return entries.filter(entry => entry.category === category).length;
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          selectedCategory === 'all'
            ? 'bg-primary-500 text-white'
            : 'bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary'
        }`}
      >
        All ({getCategoryCount('all')})
      </button>

      {categories.map(category => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center space-x-1 ${
            selectedCategory === category
              ? 'bg-primary-500 text-white'
              : 'bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary'
          }`}
        >
          <span>{getCategoryIcon(category)}</span>
          <span>
            {category} ({getCategoryCount(category)})
          </span>
        </button>
      ))}

      {categories.length === 0 && entries.length > 0 && (
        <div className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
          No categories yet
        </div>
      )}
    </div>
  );
};
