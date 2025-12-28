import React, { useState, useEffect } from 'react';
import { campaignService, type CampaignFormData, type Campaign } from '../../../services/campaignService';
import DatePicker from '../../UI/DatePicker/DatePicker';

interface EditCampaignModalProps {
    isOpen: boolean;
    campaign: Campaign | null;
    onClose: () => void;
    onSuccess?: () => void;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const EditCampaignModal: React.FC<EditCampaignModalProps> = ({ isOpen, campaign, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<CampaignFormData>({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        requiredDonorQuantity: 1,
        requiredBloodTypes: []
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Pre-populate form when campaign changes
    useEffect(() => {
        if (campaign && isOpen) {
            // Clean and parse blood types - remove brackets, quotes, and extra whitespace
            const bloodTypesString = campaign.requiredBloodType || '';
            const cleanedBloodTypes = bloodTypesString
                .replace(/[\[\]"]/g, '') // Remove brackets and quotes
                .split(',')
                .map(bt => bt.trim())
                .filter(bt => bt.length > 0); // Remove empty strings

            setFormData({
                name: campaign.name || '',
                description: campaign.description || '',
                startDate: campaign.startDate || '',
                endDate: campaign.endDate || '',
                location: campaign.location || '',
                requiredDonorQuantity: campaign.requiredDonorQuantity || 1,
                requiredBloodTypes: cleanedBloodTypes
            });

            // Clear any previous errors
            setErrors({});
            setMessage(null);
        }
    }, [campaign, isOpen]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            // Save current scroll position
            const scrollY = window.scrollY;

            // Lock scroll
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';

            return () => {
                // Restore scroll
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'requiredDonorQuantity') {
            const numValue = parseInt(value.replace(/\D/g, ''), 10) || 0;
            setFormData(prev => ({ ...prev, [name]: numValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBloodTypeToggle = (bloodType: string) => {
        setFormData(prev => {
            const isSelected = prev.requiredBloodTypes.includes(bloodType);
            return {
                ...prev,
                requiredBloodTypes: isSelected
                    ? prev.requiredBloodTypes.filter(bt => bt !== bloodType)
                    : [...prev.requiredBloodTypes, bloodType]
            };
        });
        if (errors.requiredBloodTypes) {
            setErrors(prev => ({ ...prev, requiredBloodTypes: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
        if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria';
        if (!formData.startDate) newErrors.startDate = 'La fecha de inicio es obligatoria';
        if (!formData.endDate) newErrors.endDate = 'La fecha de fin es obligatoria';
        if (!formData.location.trim()) newErrors.location = 'La ubicación es obligatoria';

        if (formData.requiredDonorQuantity <= 0) {
            newErrors.requiredDonorQuantity = 'La cantidad debe ser mayor a 0';
        }

        if (formData.requiredBloodTypes.length === 0) {
            newErrors.requiredBloodTypes = 'Selecciona al menos un tipo de sangre';
        }

        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            if (end < start) {
                newErrors.endDate = 'La fecha de fin debe ser posterior a la de inicio';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!campaign) {
            setMessage({ type: 'error', text: 'No se pudo identificar la campaña a editar' });
            return;
        }

        if (!validateForm()) {
            setMessage({ type: 'error', text: 'Por favor, corrige los errores en el formulario' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await campaignService.updateCampaign(campaign.id, formData);
            setMessage({ type: 'success', text: 'Campaña actualizada exitosamente' });

            // Call success callback
            if (onSuccess) {
                onSuccess();
            }

            // Close modal after a short delay
            setTimeout(() => {
                onClose();
                setErrors({});
                setMessage(null);
            }, 1500);
        } catch (error: any) {
            console.error('Error updating campaign:', error);

            // Check if it's a 401 error (session expired)
            const isSessionExpired = error.response?.status === 401;

            // Function to translate technical errors to user-friendly messages
            const getUserFriendlyError = (error: any): string => {
                // Check for network errors
                if (!error.response) {
                    return '❌ No se pudo conectar con el servidor. Verifica tu conexión a internet.';
                }

                const status = error.response.status;
                const data = error.response.data;

                // Map HTTP status codes to friendly messages
                switch (status) {
                    case 400:
                        return '❌ Los datos ingresados no son válidos. Por favor, revisa la información.';
                    case 401:
                        return '❌ Tu sesión ha expirado. Redirigiendo al inicio de sesión...';
                    case 403:
                        return '❌ No tienes permisos para editar esta campaña.';
                    case 404:
                        return '❌ La campaña que intentas editar ya no existe.';
                    case 409:
                        return '❌ Ya existe una campaña con ese nombre en las mismas fechas.';
                    case 422:
                        return '❌ Los datos del formulario son incorrectos. Verifica las fechas y cantidades.';
                    case 500:
                        return '❌ Ocurrió un error en el servidor. Intenta nuevamente en unos momentos.';
                    case 503:
                        return '❌ El servidor está temporalmente fuera de servicio. Intenta más tarde.';
                    default:
                        // Try to extract message from response
                        if (typeof data === 'string' && !data.includes('status code')) {
                            return `❌ ${data}`;
                        }
                        if (data?.message && !data.message.includes('status code')) {
                            return `❌ ${data.message}`;
                        }
                        if (data?.error && !data.error.includes('status code')) {
                            return `❌ ${data.error}`;
                        }
                        return '❌ No se pudo actualizar la campaña. Intenta nuevamente.';
                }
            };

            const friendlyMessage = getUserFriendlyError(error);
            setMessage({ type: 'error', text: friendlyMessage });

            // If session expired, redirect to login after showing message
            if (isSessionExpired) {
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !campaign) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
            {/* Backdrop - click to close */}
            <div
                className="absolute inset-0"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Editar Campaña</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        type="button"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Message */}
                    {message && (
                        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nombre de la campaña *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                placeholder="Ej: Campaña de donación de sangre 2025"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Descripción *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                placeholder="Describe el objetivo de la campaña..."
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Fecha de inicio *
                                </label>
                                <DatePicker
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={(e) => {
                                        handleInputChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
                                    }}
                                    error={errors.startDate}
                                />
                                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Fecha de fin *
                                </label>
                                <DatePicker
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={(e) => {
                                        handleInputChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
                                    }}
                                    error={errors.endDate}
                                />
                                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Ubicación *
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.location ? 'border-red-500' : 'border-gray-300dark:border-gray-600'
                                    }`}
                                placeholder="Ej: Hospital Regional, Sala A"
                            />
                            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                        </div>

                        {/* Required Donor Quantity */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Cantidad de donantes necesarios *
                            </label>
                            <input
                                type="number"
                                name="requiredDonorQuantity"
                                value={formData.requiredDonorQuantity}
                                onChange={handleInputChange}
                                min="1"
                                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.requiredDonorQuantity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                            />
                            {errors.requiredDonorQuantity && <p className="text-red-500 text-sm mt-1">{errors.requiredDonorQuantity}</p>}
                        </div>

                        {/* Blood Types */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tipos de sangre requeridos *
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {BLOOD_TYPES.map(bloodType => (
                                    <button
                                        key={bloodType}
                                        type="button"
                                        onClick={() => handleBloodTypeToggle(bloodType)}
                                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${formData.requiredBloodTypes.includes(bloodType)
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                                            }`}
                                    >
                                        {bloodType}
                                    </button>
                                ))}
                            </div>
                            {errors.requiredBloodTypes && <p className="text-red-500 text-sm mt-1">{errors.requiredBloodTypes}</p>}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCampaignModal;
