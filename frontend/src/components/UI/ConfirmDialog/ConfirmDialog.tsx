import React from 'react';
import Modal from '../../Modals/Modal/Modal';
import Button from '../Button/Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger',
    isLoading = false,
}) => {
    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            message={message}
            type={variant === 'danger' ? 'error' : variant === 'warning' ? 'info' : 'success'}
        >
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                    variant="gray"
                    textColor="black"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1"
                >
                    {cancelText}
                </Button>
                <Button
                    variant={variant === 'danger' ? 'red' : 'blue'}
                    onClick={handleConfirm}
                    disabled={isLoading}
                    aria-busy={isLoading}
                    className="flex-1"
                >
                    {isLoading ? 'Procesando...' : confirmText}
                </Button>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;
