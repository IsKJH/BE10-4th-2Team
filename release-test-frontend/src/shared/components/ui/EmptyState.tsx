import React from 'react';
import { FiInbox } from 'react-icons/fi';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon = <FiInbox size={48} />,
    title,
    description,
    action,
    className = ''
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-6 px-4 text-center ${className}`}>
            <div className="mb-3 text-gray-400">
                {icon}
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
                {title}
            </h3>
            {description && (
                <p className="text-gray-500 mb-4 max-w-md text-sm">
                    {description}
                </p>
            )}
            {action && (
                <div>
                    {action}
                </div>
            )}
        </div>
    );
};

export default EmptyState;