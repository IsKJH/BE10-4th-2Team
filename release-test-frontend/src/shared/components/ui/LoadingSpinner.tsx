import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'secondary' | 'gray';
    message?: string;
    fullScreen?: boolean;
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    color = 'primary',
    message,
    fullScreen = false,
    className = ''
}) => {
    const containerClass = fullScreen ? 'loading-container-fullscreen' : 'loading-container';
    const spinnerClass = `loading-spinner loading-spinner-${size} loading-spinner-${color}`;
    
    return (
        <div className={`${containerClass} ${className}`}>
            <div className={spinnerClass}></div>
            {message && (
                <p className="loading-message">{message}</p>
            )}
        </div>
    );
};

export default LoadingSpinner;