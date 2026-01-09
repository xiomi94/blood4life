import React from 'react';

interface BloodDonorProfile {
    id: number;
    firstName: string;
    lastName: string;
    bloodType: any;
    dni: string;
    email?: string;
    phoneNumber?: string;
    gender?: string;
    dateOfBirth?: string;
    imageName?: string;
}

interface ViewDonorModalProps {
    donor: BloodDonorProfile;
    onClose: () => void;
}
const ViewDonorModal: React.FC<ViewDonorModalProps> = ({ donor, onClose }) => {
    // const { t } = useTranslation(); // Removed unused t

    const getBloodTypeString = (bt: any) => {
        if (!bt) return 'N/A';
        if (typeof bt === 'string') return bt;
        return bt.type || 'N/A';
    };

    const translateGender = (gender?: string) => {
        if (!gender) return 'N/A';
        const lower = gender.toLowerCase();
        if (lower === 'male') return 'Masculino';
        if (lower === 'female') return 'Femenino';
        return gender;
    };

    const imageUrl = donor.imageName
        ? `/images/${donor.imageName}`
        : null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                    <span className="text-2xl">&times;</span>
                </button>

                <div className="text-center mb-6">
                    <div className="inline-block relative">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={`${donor.firstName} ${donor.lastName}`}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg mx-auto"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mx-auto mb-2 text-gray-400">
                                <span className="text-4xl">👤</span>
                            </div>
                        )}
                        <span className="absolute bottom-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm border-2 border-white dark:border-gray-800">
                            {getBloodTypeString(donor.bloodType)}
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-4">
                        {donor.firstName} {donor.lastName}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{donor.email}</p>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">DNI</p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{donor.dni}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Teléfono</p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{donor.phoneNumber || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Género</p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{translateGender(donor.gender)}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Fecha Nacimiento</p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                                {donor.dateOfBirth ? new Date(donor.dateOfBirth).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl font-medium transition-colors"
                    >
                        Cerrar Perfil
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewDonorModal;
