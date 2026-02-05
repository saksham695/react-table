import React from 'react';
import './LoadingState.css';

interface LoadingStateProps {
  message?: string;
}

/**
 * Loading state component with spinner
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading data...',
}) => {
  return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};
