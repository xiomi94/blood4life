interface DeleteAccountModalProps {
    isOpen: boolean;
    deleteConfirmText: string;
    loading: boolean;
    onConfirmTextChange: (text: string) => void;
    onCancel: () => void;
    onConfirm: () => void;
}

/**
 * Component for delete account confirmation modal
 * - Requires typing "ELIMINAR" to confirm
 * - 100% shared between donor and hospital
 */
export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
    isOpen,
    deleteConfirmText,
    loading,
    onConfirmTextChange,
    onCancel,
    onConfirm
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-3">
                    ¿Estás absolutamente seguro?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Esta acción <strong>no se puede deshacer</strong>. Tu cuenta será eliminada permanentemente.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Por favor escribe <strong className="text-red-600 dark:text-red-400">ELIMINAR</strong> para confirmar:
                </p>
                <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => onConfirmTextChange(e.target.value)}
                    placeholder="Escribe ELIMINAR aquí"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4"
                />
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading || deleteConfirmText !== 'ELIMINAR'}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Eliminando...' : 'Borrar Cuenta'}
                    </button>
                </div>
            </div>
        </div>
    );
};
