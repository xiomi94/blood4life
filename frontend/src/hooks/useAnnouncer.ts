// hooks/useAnnouncer.ts
import { useEffect, useRef, useCallback } from 'react';

type AnnouncementPriority = 'polite' | 'assertive';

/**
 * Hook para anunciar mensajes dinámicos a lectores de pantalla
 * Útil para notificaciones, mensajes de éxito/error, cambios de estado
 */
export const useAnnouncer = () => {
    const politeRef = useRef<HTMLDivElement | null>(null);
    const assertiveRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Create aria-live regions if they don't exist
        if (!politeRef.current) {
            const politeRegion = document.createElement('div');
            politeRegion.setAttribute('aria-live', 'polite');
            politeRegion.setAttribute('aria-atomic', 'true');
            politeRegion.className = 'sr-only';
            document.body.appendChild(politeRegion);
            politeRef.current = politeRegion;
        }

        if (!assertiveRef.current) {
            const assertiveRegion = document.createElement('div');
            assertiveRegion.setAttribute('aria-live', 'assertive');
            assertiveRegion.setAttribute('aria-atomic', 'true');
            assertiveRegion.className = 'sr-only';
            document.body.appendChild(assertiveRegion);
            assertiveRef.current = assertiveRegion;
        }

        return () => {
            // Cleanup on unmount
            if (politeRef.current) {
                document.body.removeChild(politeRef.current);
                politeRef.current = null;
            }
            if (assertiveRef.current) {
                document.body.removeChild(assertiveRef.current);
                assertiveRef.current = null;
            }
        };
    }, []);

    const announce = useCallback((message: string, priority: AnnouncementPriority = 'polite') => {
        const region = priority === 'assertive' ? assertiveRef.current : politeRef.current;

        if (region) {
            // Clear previous message
            region.textContent = '';

            // Use setTimeout to ensure screen readers detect the change
            setTimeout(() => {
                region.textContent = message;
            }, 100);
        }
    }, []);

    return { announce };
};
