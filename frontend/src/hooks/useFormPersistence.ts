import { useEffect, useRef } from 'react';

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
    // Controlamos si ya hemos cargado los datos iniciales
    const hasLoadedRef = useRef(false);

    // Cargar datos al entrar (Mount)
    useEffect(() => {
        if (!hasLoadedRef.current) {
            try {
                // Buscamos en localStorage
                const savedData = localStorage.getItem(storageKey);
                if (savedData) {
                    const parsedData = JSON.parse(savedData);

                    // Filtramos los campos que no queremos recuperar (ej. contraseñas)
                    const restoredData: Partial<T> = {};
                    Object.keys(parsedData).forEach((key) => {
                        if (!excludeFields.includes(key)) {
                            restoredData[key as keyof T] = parsedData[key];
                        }
                    });

                    // Si hay datos, actualizamos el formulario
                    if (Object.keys(restoredData).length > 0) {
                        setFormData(prev => ({ ...prev, ...restoredData }));
                    }
                }
                hasLoadedRef.current = true;
            } catch (error) {
                console.error('Error al cargar datos del localStorage:', error);
                hasLoadedRef.current = true;
            }
        }
    }, [storageKey, setFormData]); // Dependencias básicas

    // Guardar datos cada vez que cambian
    useEffect(() => {
        if (hasLoadedRef.current) {
            try {
                // Preparamos objeto para guardar sin los campos excluidos
                const dataToSave: Partial<T> = {};
                Object.keys(formData).forEach((key) => {
                    if (!excludeFields.includes(key)) {
                        dataToSave[key as keyof T] = formData[key as keyof T];
                    }
                });

                // Guardamos en localStorage
                localStorage.setItem(storageKey, JSON.stringify(dataToSave));
            } catch (error) {
                console.error('Error al guardar en localStorage:', error);
            }
        }
    }, [formData, storageKey]); // Se ejecuta cuando cambia el formulario

    // Función para limpiar datos manualmente (ej. al hacer login)
    const clearPersistedData = () => {
        try {
            localStorage.removeItem(storageKey);
        } catch (error) {
            console.error('Error al borrar del localStorage:', error);
        }
    };

    return { clearPersistedData };
}

