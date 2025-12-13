import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'rectangular',
    width,
    height,
    animation = 'pulse',
}) => {
    const baseStyles = 'bg-gray-200';

    const variantStyles = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-md',
    };

    const animationStyles = {
        pulse: 'animate-pulse',
        wave: 'animate-shimmer',
        none: '',
    };

    const style: React.CSSProperties = {
        width: width || undefined,
        height: height || undefined,
    };

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
            style={style}
            role="status"
            aria-label="Cargando contenido"
        >
            <span className="sr-only">Cargando...</span>
        </div>
    );
};

export default Skeleton;
