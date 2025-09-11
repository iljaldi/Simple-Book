import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// Issue Card Component
export interface IssueCardProps {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done' | 'canceled';
  priority: 'no-priority' | 'urgent' | 'high' | 'medium' | 'low';
  assignee?: {
    name: string;
    avatar?: string;
  };
  labels?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  dueDate?: string;
  createdAt?: string;
  onClick?: () => void;
  className?: string;
}

const IssueCard: React.FC<IssueCardProps> = ({
  id,
  title,
  description,
  status,
  priority,
  assignee,
  labels,
  dueDate,
  createdAt,
  onClick,
  className
}) => {
  const statusConfig = {
    todo: { label: 'Todo', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' },
    'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    done: { label: 'Done', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    canceled: { label: 'Canceled', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
  };

  const priorityConfig = {
    'no-priority': { icon: 'minus', color: 'text-gray-400' },
    urgent: { icon: 'alert-triangle', color: 'text-red-500' },
    high: { icon: 'chevron-up', color: 'text-orange-500' },
    medium: { icon: 'minus', color: 'text-yellow-500' },
    low: { icon: 'chevron-down', color: 'text-green-500' }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 bg-white border border-gray-200 rounded-lg hover:shadow-medium transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700',
        className
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {id}
          </span>
          <span className={cn('px-2 py-1 text-xs rounded-full', statusConfig[status].color)}>
            {statusConfig[status].label}
          </span>
        </div>
        <span className={`text-sm ${priorityConfig[priority].color}`}>
          {priorityConfig[priority].icon || '📋'}
        </span>
      </div>
      
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {description}
        </p>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {labels && labels.length > 0 && (
            <div className="flex space-x-1">
              {labels.slice(0, 3).map(label => (
                <span
                  key={label.id}
                  className="px-2 py-1 text-xs rounded-full"
                  style={{ backgroundColor: label.color + '20', color: label.color }}
                >
                  {label.name}
                </span>
              ))}
              {labels.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{labels.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {assignee && (
            <div className="flex items-center space-x-1">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {assignee.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
          {dueDate && (
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <span className="text-sm">🕐</span>
              <span>{dueDate}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Activity Log Component
export interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  timestamp: string;
  details?: string;
}

export interface ActivityLogProps {
  activities: ActivityItem[];
  className?: string;
}

const ActivityLog: React.FC<ActivityLogProps> = ({
  activities,
  className
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        Activity
      </h3>
      <div className="space-y-3">
        {activities.map(activity => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {activity.user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white">
                <span className="font-medium">{activity.user.name}</span> {activity.action}
              </p>
              {activity.details && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {activity.details}
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {activity.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Comment Section Component
export interface Comment {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
}

export interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  className?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment,
  className
}) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        Comments
      </h3>
      
      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {comment.user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-sm text-gray-900 dark:text-white">
                  {comment.content}
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {comment.user.name} • {comment.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Leave a comment..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          rows={3}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Comment
          </button>
        </div>
      </form>
    </div>
  );
};

export { IssueCard, ActivityLog, CommentSection };
