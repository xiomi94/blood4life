import { useState } from 'react';
import axiosInstance from '../../../../utils/axiosInstance';
import { ROUTES } from '../../../../constants/app.constants';
import { getErrorMessage, logError } from '../../../../utils/errorHandler';
import type { UserType } from '../../../../types/common.types';

interface UseDeleteAccountReturn {
    showDeleteConfirm: boolean;
    deleteConfirmText: string;
    setDeleteConfirmText: (text: string) => void;
    showModal: () => void;
    hideModal: () => void;
    handleDeleteAccount: (onSuccess: () => void, onError: (message: string) => void) => Promise<void>;
}

/**
 * Texto de confirmación requerido para eliminar cuenta
 */
const DELETE_CONFIRMATION_TEXT = 'ELIMINAR';

/**
 * Delay antes de redirigir después de eliminar cuenta (ms)
 */
const REDIRECT_DELAY_MS = 2000;

/**
 * Obtiene el endpoint de eliminación de cuenta según el tipo de usuario
 */
const getDeleteAccountEndpoint = (userType: UserType): string => {
    const endpoints: Record<UserType, string> = {
        bloodDonor: '/bloodDonor/delete-account',
        hospital: '/hospital/delete-account',
        admin: '/admin/delete-account',
    };
    return endpoints[userType];
};

/**
 * Custom hook for managing account deletion
 * - Handles confirmation modal state
 * - Validates confirmation text
 * - Executes delete account API call
 * - Shared between donor and hospital (only endpoint differs)
 */
export const useDeleteAccount = (userType: UserType | null): UseDeleteAccountReturn => {
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
        // Validar texto de confirmación
        if (deleteConfirmText !== DELETE_CONFIRMATION_TEXT) {
            onError(`Debes escribir "${DELETE_CONFIRMATION_TEXT}" para confirmar`);
            return;
        }

        // Validar que haya un tipo de usuario
        if (!userType) {
            onError('Tipo de usuario no válido');
            return;
        }

        try {
            const endpoint = getDeleteAccountEndpoint(userType);
            await axiosInstance.delete(endpoint);

            onSuccess();

            // Redirigir después de eliminación exitosa
            setTimeout(() => {
                window.location.href = ROUTES.LOGIN;
            }, REDIRECT_DELAY_MS);
        } catch (error) {
            const errorMessage = getErrorMessage(error, 'Error al eliminar la cuenta');
            logError(error, 'useDeleteAccount.handleDeleteAccount', { userType });
            onError(errorMessage);
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
