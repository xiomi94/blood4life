// hooks/useFocusTrap.ts
import { useEffect, useRef } from 'react';

/**
 * Hook para implementar focus trap en modales y diálogos
 * Mantiene el foco dentro del elemento mientras está activo
 */
export const useFocusTrap = (isActive: boolean) => {
    const containerRef = useRef<HTMLElement | null>(null);
    const previouslyFocusedElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!isActive || !containerRef.current) return;

        // Save currently focused element
        previouslyFocusedElement.current = document.activeElement as HTMLElement;

        const container = containerRef.current;
        const focusableElements = container.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Focus first element when trap activates
        if (firstElement) {
            firstElement.focus();
        }

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        container.addEventListener('keydown', handleTabKey);

        return () => {
            container.removeEventListener('keydown', handleTabKey);

            // Restore focus to previously focused element
            if (previouslyFocusedElement.current) {
                previouslyFocusedElement.current.focus();
            }
        };
    }, [isActive]);

    return containerRef;
};
