import React from 'react';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
    className = '',
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
            {icon && (
                <div className="mb-4 text-gray-400">
                    {icon}
                </div>
            )}
            <h3 className="text-h3 font-poppins font-semibold text-gray-800 mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-body text-gray-500 max-w-md mb-6">
                    {description}
                </p>
            )}
            {action && (
                <div className="mt-4">
                    {action}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
