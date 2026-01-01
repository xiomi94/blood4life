import { useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';

interface UseDeleteAccountReturn {
    showDeleteConfirm: boolean;
    deleteConfirmText: string;
    setDeleteConfirmText: (text: string) => void;
    showModal: () => void;
    hideModal: () => void;
    handleDeleteAccount: (onSuccess: () => void, onError: (message: string) => void) => Promise<void>;
}

/**
 * Custom hook for managing account deletion
 * - Handles confirmation modal state
 * - Validates confirmation text
 * - Executes delete account API call
 * - Shared between donor and hospital (only endpoint differs)
 */
export const useDeleteAccount = (userType: 'bloodDonor' | 'hospital' | 'admin' | null): UseDeleteAccountReturn => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const showModal = () => setShowDeleteConfirm(true);
    const hideModal = () => {
        setShowDeleteConfirm(false);
        setDeleteConfirmText('');
    };

    const handleDeleteAccount = async (
        onSuccess: () => void,
        onError: (message: string) => void
    ) => {
        // Verify confirmation text
        if (deleteConfirmText !== 'ELIMINAR') {
            onError('Debes escribir "ELIMINAR" para confirmar');
            return;
        }

        try {
            const endpoint = userType === 'bloodDonor'
                ? `/bloodDonor/delete-account`
                : `/hospital/delete-account`;

            await axiosInstance.delete(endpoint);

            onSuccess();

            // Redirect after successful deletion
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (error: any) {
            console.error('Delete account error:', error);
            onError(error.response?.data?.error || 'Error al eliminar la cuenta');
        } finally {
            hideModal();
        }
    };

    return {
        showDeleteConfirm,
        deleteConfirmText,
        setDeleteConfirmText,
        showModal,
        hideModal,
        handleDeleteAccount
    };
};
