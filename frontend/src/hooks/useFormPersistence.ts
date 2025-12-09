import { useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook to persist form data in localStorage
 * @param storageKey - Unique key for localStorage
 * @param formData - Current form data state
 * @param setFormData - Function to update form data state
 * @param excludeFields - Optional array of field names to exclude from persistence (e.g., passwords)
 */
export function useFormPersistence<T extends Record<string, any>>(
    storageKey: string,
    formData: T,
    setFormData: React.Dispatch<React.SetStateAction<T>>,
    excludeFields: string[] = []
) {
    // Track if we've already loaded data from localStorage
    const hasLoadedRef = useRef(false);
    // Store exclude fields to check if they change
    const excludeFieldsRef = useRef(excludeFields);

    // Load persisted data ONLY on mount
    useEffect(() => {
        // Only load once when component mounts
        if (!hasLoadedRef.current) {
            try {
                const savedData = localStorage.getItem(storageKey);
                if (savedData) {
                    const parsedData = JSON.parse(savedData);

                    // Restore only non-excluded fields
                    const restoredData: Partial<T> = {};
                    Object.keys(parsedData).forEach((key) => {
                        if (!excludeFieldsRef.current.includes(key)) {
                            restoredData[key as keyof T] = parsedData[key];
                        }
                    });

                    if (Object.keys(restoredData).length > 0) {
                        setFormData(prev => ({ ...prev, ...restoredData }));
                    }
                }
                hasLoadedRef.current = true;
            } catch (error) {
                console.error('Error loading form data from localStorage:', error);
                hasLoadedRef.current = true;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storageKey]); // Only depend on storageKey, load once per key

    // Save form data to localStorage whenever it changes
    useEffect(() => {
        // Only save if we've already loaded initial data
        if (hasLoadedRef.current) {
            try {
                // Filter out excluded fields before saving
                const dataToSave: Partial<T> = {};
                Object.keys(formData).forEach((key) => {
                    if (!excludeFieldsRef.current.includes(key)) {
                        dataToSave[key as keyof T] = formData[key as keyof T];
                    }
                });

                localStorage.setItem(storageKey, JSON.stringify(dataToSave));
            } catch (error) {
                console.error('Error saving form data to localStorage:', error);
            }
        }
    }, [formData, storageKey]);

    // Function to clear persisted data
    const clearPersistedData = useCallback(() => {
        try {
            localStorage.removeItem(storageKey);
        } catch (error) {
            console.error('Error clearing form data from localStorage:', error);
        }
    }, [storageKey]);

    return { clearPersistedData };
}

