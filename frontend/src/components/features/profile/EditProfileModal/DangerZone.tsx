interface DangerZoneProps {
    onDeleteClick: () => void;
}

/**
 * Component for the danger zone section
 * - Shows warning about account deletion
 * - Button to trigger delete confirmation
 * - 100% shared between donor and hospital
 */
export const DangerZone: React.FC<DangerZoneProps> = ({ onDeleteClick }) => {
    return (
        <div className="mt-6 border-t border-red-200 dark:border-red-900 pt-6">
            <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">
                Zona de Peligro
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Una vez que borres tu cuenta, no hay vuelta atrás. Por favor, asegúrate.
            </p>
            <button
                type="button"
                onClick={onDeleteClick}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
                Borrar Cuenta
            </button>
        </div>
    );
};
