import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  badge?: string | number;
  children?: NavItem[];
  onClick?: () => void;
}

export interface NavigationSidebarProps {
  items?: NavItem[];
  activeItem?: string;
  onItemClick?: (item: NavItem) => void;
  className?: string;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  items = [],
  activeItem,
  onItemClick,
  className
}) => {
  // Default navigation items
  const defaultItems: NavItem[] = [
    {
      id: 'issues',
      label: 'Issues',
      icon: 'ri-file-list-line',
      href: '/issues'
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: 'ri-folder-line',
      href: '/projects'
    },
    {
      id: 'teams',
      label: 'Teams',
      icon: 'ri-team-line',
      href: '/teams'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'ri-settings-line',
      href: '/settings'
    }
  ];

  const navigationItems = items.length > 0 ? items : defaultItems;
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (item: NavItem) => {
    if (item.children) {
      toggleExpanded(item.id);
    }
    onItemClick?.(item);
    item.onClick?.();
  };

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const isActive = activeItem === item.id;
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <button
          onClick={() => handleItemClick(item)}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            isActive && 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
            !isActive && 'text-gray-700 dark:text-gray-300',
            level > 0 && 'ml-4'
          )}
        >
          <div className="flex items-center">
            {item.icon && (
              <i className={`ri ${item.icon} mr-3 text-sm`} />
            )}
            <span>{item.label}</span>
          </div>
          <div className="flex items-center">
            {item.badge && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-800 rounded-full dark:bg-gray-700 dark:text-gray-200">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <i className={`ri ${isExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} ml-2 text-sm`} />
            )}
          </div>
        </button>
        
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={cn('w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700', className)}>
      <div className="p-4">
        <div className="space-y-1">
          {navigationItems.map(item => renderNavItem(item))}
        </div>
      </div>
    </nav>
  );
};

// Workspace Header Component
export interface WorkspaceHeaderProps {
  name: string;
  icon?: string;
  onSettingsClick?: () => void;
  className?: string;
}

const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  name,
  icon,
  onSettingsClick,
  className
}) => {
  return (
    <div className={cn('flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700', className)}>
      <div className="flex items-center">
        {icon && (
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm font-medium">
              {icon}
            </span>
          </div>
        )}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {name}
        </h2>
      </div>
      {onSettingsClick && (
        <button
          onClick={onSettingsClick}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <Icon name="settings" size="small" className="text-gray-500" />
        </button>
      )}
    </div>
  );
};

// Quick Actions Component
export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  className
}) => {
  return (
    <div className={cn('p-4 space-y-2', className)}>
      {actions.map(action => (
        <button
          key={action.id}
          onClick={action.onClick}
          className={cn(
            'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            action.variant === 'primary' 
              ? 'bg-purple-600 text-white hover:bg-purple-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          )}
        >
          <i className={`ri ${action.icon} mr-3 text-sm`} />
          {action.label}
        </button>
      ))}
    </div>
  );
};

export { NavigationSidebar, WorkspaceHeader, QuickActions };
