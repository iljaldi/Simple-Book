import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// Filter Component
export interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
}

export interface FilterProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  className?: string;
}

const Filter: React.FC<FilterProps> = ({
  label,
  options,
  selectedValues,
  onSelectionChange,
  multiple = true,
  searchable = false,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleOptionClick = (value: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];
      onSelectionChange(newValues);
    } else {
      onSelectionChange([value]);
      setIsOpen(false);
    }
  };

  const selectedLabels = options
    .filter(option => selectedValues.includes(option.value))
    .map(option => option.label);

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        <div className="flex items-center">
          <span className="text-gray-700 dark:text-gray-300">{label}</span>
          {selectedValues.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full dark:bg-purple-900 dark:text-purple-200">
              {selectedValues.length}
            </span>
          )}
        </div>
        <i className={`ri ${isOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-gray-400 text-sm`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-medium dark:bg-gray-700 dark:border-gray-600">
          {searchable && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-600">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-100"
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map(option => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.value)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600',
                  selectedValues.includes(option.value) && 'bg-purple-50 dark:bg-purple-900/20'
                )}
              >
                <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
                <div className="flex items-center">
                  {option.count && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                      {option.count}
                    </span>
                  )}
                  {selectedValues.includes(option.value) && (
                    <i className="ri-check-line text-purple-600 text-sm" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// View Options Component
export interface ViewOption {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
}

export interface ViewOptionsProps {
  options: ViewOption[];
  onViewChange: (viewId: string) => void;
  className?: string;
}

const ViewOptions: React.FC<ViewOptionsProps> = ({
  options,
  onViewChange,
  className
}) => {
  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {options.map(option => (
        <button
          key={option.id}
          onClick={() => onViewChange(option.id)}
          className={cn(
            'p-2 rounded-lg transition-colors',
            option.active 
              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
              : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
          )}
        >
          <i className={`ri ${option.icon || 'ri-file-list-line'} text-sm`} />
        </button>
      ))}
    </div>
  );
};

// Radio Group Component
export interface RadioOption {
  id: string;
  label: string;
  value: string;
  description?: string;
}

export interface RadioGroupProps {
  options: RadioOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  name: string;
  className?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  selectedValue,
  onValueChange,
  name,
  className
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {options.map(option => (
        <label
          key={option.id}
          className="flex items-start space-x-3 cursor-pointer"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={(e) => onValueChange(e.target.value)}
            className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {option.label}
            </div>
            {option.description && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {option.description}
              </div>
            )}
          </div>
        </label>
      ))}
    </div>
  );
};

// Display Properties Component
export interface DisplayProperty {
  id: string;
  label: string;
  enabled: boolean;
}

export interface DisplayPropertiesProps {
  properties: DisplayProperty[];
  onPropertyToggle: (propertyId: string) => void;
  className?: string;
}

const DisplayProperties: React.FC<DisplayPropertiesProps> = ({
  properties,
  onPropertyToggle,
  className
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Display properties
      </h4>
      <div className="space-y-1">
        {properties.map(property => (
          <label
            key={property.id}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={property.enabled}
              onChange={() => onPropertyToggle(property.id)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {property.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export { Filter, ViewOptions, RadioGroup, DisplayProperties };
