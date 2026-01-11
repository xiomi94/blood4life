import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { campaignService, type CampaignFormData } from '../../../../services/campaignService';
import DatePicker from '../../../common/forms/DatePicker/DatePicker';

interface CreateCampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ isOpen, onClose, onSuccess }) => {
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

        // Special handling for number fields to prevent decimal/thousand separators
        if (name === 'requiredDonorQuantity') {
            // Remove any non-digit characters and parse as integer
            const numValue = parseInt(value.replace(/\D/g, ''), 10) || 0;
            setFormData(prev => ({ ...prev, [name]: numValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Función para añadir o quitar tipos de sangre de la lista
    const handleBloodTypeToggle = (bloodType: string) => {
        // Hacemos una copia de los tipos seleccionados
        const currentTypes = [...formData.requiredBloodTypes];

        if (currentTypes.includes(bloodType)) {
            // Si ya está seleccionado, lo quitamos
            setFormData(prev => ({
                ...prev,
                requiredBloodTypes: currentTypes.filter(type => type !== bloodType)
            }));
        } else {
            // Si no está, lo añadimos
            currentTypes.push(bloodType);
            setFormData(prev => ({
                ...prev,
                requiredBloodTypes: currentTypes
            }));
        }

        // Limpiamos el error si existía
        if (errors.requiredBloodTypes) {
            setErrors(prev => ({ ...prev, requiredBloodTypes: '' }));
        }
    };

    // Validar el formulario antes de enviar
    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // Validar campos obligatorios
        if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
        if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria';
        if (!formData.startDate) newErrors.startDate = 'La fecha de inicio es obligatoria';
        if (!formData.endDate) newErrors.endDate = 'La fecha de fin es obligatoria';
        if (!formData.location.trim()) newErrors.location = 'La ubicación es obligatoria';

        // Validar cantidad positiva
        if (formData.requiredDonorQuantity <= 0) {
            newErrors.requiredDonorQuantity = 'La cantidad debe ser mayor a 0';
        }

        // Validar que haya tipos de sangre seleccionados
        if (formData.requiredBloodTypes.length === 0) {
            newErrors.requiredBloodTypes = 'Selecciona al menos un tipo de sangre';
        }

        // Validar que la fecha de fin sea después de la de inicio
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            if (end < start) {
                newErrors.endDate = 'La fecha de fin debe ser posterior a la de inicio';
            }
        }

        setErrors(newErrors);
        // Devolvemos true si no hay errores
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await campaignService.createCampaign(formData);
            toast.success('Campaña creada exitosamente');

            // Reset form
            setFormData({
                name: '',
                description: '',
                startDate: '',
                endDate: '',
                location: '',
                requiredDonorQuantity: 1,
                requiredBloodTypes: []
            });

            // Call success callback
            if (onSuccess) {
                onSuccess();
            }

            // Close modal after a short delay
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error: any) {
            console.error('Error creating campaign:', error);
            const errorMsg = error.response?.data?.error || 'Error al crear la campaña';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

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
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Nueva Campaña</h2>
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
                                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
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
                            {loading ? 'Creando...' : 'Crear Campaña'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCampaignModal;
