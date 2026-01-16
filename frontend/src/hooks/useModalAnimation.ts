import { useState, useEffect } from 'react';

export const useModalAnimation = (isOpen: boolean, duration: number = 200) => {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            // Double RAF to ensure mounting happens before animation start
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsVisible(true);
                });
            });
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, duration]);

    return { shouldRender, isVisible };
};
