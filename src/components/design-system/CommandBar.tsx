import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface CommandOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  shortcut?: string;
  category?: string;
  action?: () => void;
}

export interface CommandBarProps {
  placeholder?: string;
  options?: CommandOption[];
  onSelect?: (option: CommandOption) => void;
  className?: string;
}

const CommandBar: React.FC<CommandBarProps> = ({
  placeholder = 'Type a command or search...',
  options = [],
  onSelect,
  className
}) => {
  // Default command options
  const defaultOptions: CommandOption[] = [
    {
      id: 'new-issue',
      label: 'New Issue',
      description: 'Create a new issue',
      icon: 'ri-add-line',
      shortcut: '⌘N',
      category: 'Actions'
    },
    {
      id: 'search',
      label: 'Search',
      description: 'Search issues and projects',
      icon: 'ri-search-line',
      shortcut: '⌘K',
      category: 'Navigation'
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Open settings',
      icon: 'ri-settings-line',
      shortcut: '⌘,',
      category: 'Navigation'
    },
    {
      id: 'help',
      label: 'Help',
      description: 'Get help and documentation',
      icon: 'ri-question-line',
      shortcut: '⌘?',
      category: 'Navigation'
    }
  ];

  const commandOptions = options.length > 0 ? options : defaultOptions;
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredOptions, setFilteredOptions] = useState<CommandOption[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = commandOptions.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
    setSelectedIndex(0);
  }, [searchTerm]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[selectedIndex]) {
          handleSelect(filteredOptions[selectedIndex]);
        }
        break;
    }
  };

  const handleSelect = (option: CommandOption) => {
    onSelect?.(option);
    option.action?.();
    setIsOpen(false);
    setSearchTerm('');
  };

  const groupedOptions = filteredOptions.reduce((acc, option) => {
    const category = option.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(option);
    return acc;
  }, {} as Record<string, CommandOption[]>);

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        <div className="flex items-center">
          <i className="ri-search-line mr-3 text-gray-400 text-sm" />
          <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
        </div>
        <div className="flex items-center space-x-1">
          <kbd className="px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded dark:bg-gray-600 dark:border-gray-500">
            ⌘K
          </kbd>
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-2xl mx-4">
            <div className="bg-white border border-gray-300 rounded-lg shadow-2xl dark:bg-gray-800 dark:border-gray-600">
              <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <i className="ri-search-line mr-3 text-gray-400 text-sm" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              
              <div 
                ref={listRef}
                className="max-h-96 overflow-y-auto"
              >
                {Object.keys(groupedOptions).length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <i className="ri-search-line mx-auto mb-2 text-gray-300 text-2xl" />
                    <p>No results found</p>
                    <p className="text-sm">Go to advanced search</p>
                  </div>
                ) : (
                  Object.entries(groupedOptions).map(([category, categoryOptions]) => (
                    <div key={category}>
                      {Object.keys(groupedOptions).length > 1 && (
                        <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                          {category}
                        </div>
                      )}
                      {categoryOptions.map((option, index) => {
                        const globalIndex = filteredOptions.indexOf(option);
                        return (
                          <button
                            key={option.id}
                            onClick={() => handleSelect(option)}
                            className={cn(
                              'w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700',
                              globalIndex === selectedIndex && 'bg-purple-50 dark:bg-purple-900/20'
                            )}
                          >
                            {option.icon && (
                              <i className={`ri ${option.icon} mr-3 text-gray-400 text-sm`} />
                            )}
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {option.label}
                              </div>
                              {option.description && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {option.description}
                                </div>
                              )}
                            </div>
                            {option.shortcut && (
                              <kbd className="px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded dark:bg-gray-600 dark:border-gray-500">
                                {option.shortcut}
                              </kbd>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { CommandBar };
