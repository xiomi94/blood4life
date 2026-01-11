import React, { useState } from 'react';

interface TooltipProps {
    content: string;
    children: React.ReactElement;
    position?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
    content,
    children,
    position = 'top',
    className = '',
}) => {
    const [isVisible, setIsVisible] = useState(false);

    const positionStyles = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    const arrowStyles = {
        top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900',
        left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900',
        right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900',
    };

    return (
        <div
            className={`relative inline-block ${className}`}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div
                    className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap ${positionStyles[position]} transition-opacity`}
                    role="tooltip"
                >
                    {content}
                    <div
                        className={`absolute w-0 h-0 border-4 border-transparent ${arrowStyles[position]}`}
                        aria-hidden="true"
                    />
                </div>
            )}
        </div>
    );
};

export default Tooltip;
