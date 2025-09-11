import React, { useState, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';

export interface Tag {
  id: string;
  label: string;
  color?: string;
  icon?: string;
}

export interface TagInputProps {
  tags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  maxTags?: number;
  className?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onTagsChange,
  placeholder = 'Add tags...',
  label,
  error,
  helperText,
  disabled = false,
  maxTags,
  className
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1].id);
    }
  };

  const addTag = (label: string) => {
    if (maxTags && tags.length >= maxTags) return;
    
    const newTag: Tag = {
      id: Date.now().toString(),
      label,
      color: getRandomColor()
    };
    
    onTagsChange([...tags, newTag]);
    setInputValue('');
  };

  const removeTag = (tagId: string) => {
    onTagsChange(tags.filter(tag => tag.id !== tagId));
  };

  const getRandomColor = () => {
    const colors = [
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div
        className={cn(
          'w-full min-h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white focus-within:border-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-0 dark:border-gray-600 dark:bg-gray-700',
          error && 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className={cn(
                'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium',
                tag.color || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              )}
            >
              {tag.icon && (
                <Icon 
                  name={tag.icon} 
                  size="small" 
                  className="mr-1" 
                />
              )}
              {tag.label}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(tag.id)}
                  className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                >
                  <Icon 
                    name="x" 
                    size="small" 
                    className="text-current" 
                  />
                </button>
              )}
            </div>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={tags.length === 0 ? placeholder : ''}
            disabled={disabled}
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

export { TagInput };
