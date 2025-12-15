import { useState, useEffect } from 'react';

interface UseImageUploadReturn {
    imageFile: File | null;
    imagePreview: string | null;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setImagePreview: (preview: string | null) => void;
}

/**
 * Custom hook for managing profile image upload
 * - Handles file selection
 * - Generates image preview using FileReader
 * - 100% shared between donor and hospital
 */
export const useImageUpload = (user: any): UseImageUploadReturn => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(() => {
        // Initialize with existing user image if available
        return user?.imageName ? `/images/${user.imageName}` : null;
    });

    // Update image preview when user data changes
    useEffect(() => {
        if (user?.imageName && !imageFile) {
            setImagePreview(`/images/${user.imageName}`);
        } else if (!user?.imageName && !imageFile) {
            setImagePreview(null);
        }
    }, [user?.imageName, imageFile]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return {
        imageFile,
        imagePreview,
        handleImageChange,
        setImagePreview
    };
};
