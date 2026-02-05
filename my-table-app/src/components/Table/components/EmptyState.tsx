import React from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Empty state component when no data is available
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data found',
  description = 'There are no records to display at the moment.',
  icon = '📋',
  action,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {action && (
        <button className="empty-state-action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
};
