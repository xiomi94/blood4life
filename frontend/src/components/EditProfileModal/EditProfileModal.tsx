import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import { validateDNI, validateCIF, validateName, validateAddress, validatePhoneNumber, validatePostalCode, getFieldLabel } from './validationUtils';
import { useImageUpload } from './useImageUpload';
import { usePasswordChange } from './usePasswordChange';
import { useDeleteAccount } from './useDeleteAccount';
import { ProfileImageUpload } from './ProfileImageUpload';
import { DonorFields } from './DonorFields';
import { HospitalFields } from './HospitalFields';
import { PasswordChangeSection } from './PasswordChangeSection';
import { DangerZone } from './DangerZone';
import { DeleteAccountModal } from './DeleteAccountModal';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
    const { user, userType, refreshUser } = useAuth();
    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Custom hooks
    const imageUpload = useImageUpload(user);
    const passwordChange = usePasswordChange(userType);
    const deleteAccount = useDeleteAccount(userType);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            // Save current scroll position
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';

            return () => {
                // Restore scroll position
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen]);

    // Clear message when modal opens
    useEffect(() => {
        if (isOpen) {
            setMessage(null);
        }
    }, [isOpen]);

    // Pre-fill form with current user data
    useEffect(() => {
        if (user && userType) {
            setFormData({
                ...user,
                bloodTypeId: user.bloodType?.id || '',
            });
        }
    }, [user, userType]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error when user starts typing again
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: any = {};

        if (userType === 'bloodDonor') {
            newErrors.dni = validateDNI(formData.dni || '');
            newErrors.firstName = validateName(formData.firstName || '', getFieldLabel('firstName'));
            newErrors.lastName = validateName(formData.lastName || '', getFieldLabel('lastName'));
            newErrors.phoneNumber = validatePhoneNumber(formData.phoneNumber || '');
        } else if (userType === 'hospital') {
            newErrors.cif = validateCIF(formData.cif || '');
            newErrors.name = validateName(formData.name || '', getFieldLabel('name'));
            newErrors.address = validateAddress(formData.address || '');
            newErrors.postalCode = validatePostalCode(formData.postalCode || '');
            newErrors.phoneNumber = validatePhoneNumber(formData.phoneNumber || '');
        }

        const hasErrors = Object.values(newErrors).some(error => error !== '');

        if (hasErrors) {
            setErrors(newErrors);
            setMessage({ type: 'error', text: 'Por favor, corrige los errores en el formulario' });
        }

        return !hasErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Validate form
        if (!validateForm()) {
            setLoading(false);
            return;
        }

        // Validate passwords if password change is requested
        if (passwordChange.showPasswordFields && passwordChange.passwordData.currentPassword && passwordChange.passwordData.newPassword) {
            if (!passwordChange.validatePasswords()) {
                setLoading(false);
                setMessage({ type: 'error', text: 'Por favor, corrige los errores en la contraseña' });
                return;
            }
        }

        try {
            // Build form data for profile update
            const formDataToSend = new FormData();

            if (userType === 'bloodDonor') {
                formDataToSend.append('dni', formData.dni || '');
                formDataToSend.append('firstName', formData.firstName || '');
                formDataToSend.append('lastName', formData.lastName || '');
                formDataToSend.append('gender', formData.gender || '');
                formDataToSend.append('bloodTypeId', formData.bloodTypeId?.toString() || formData.bloodType?.id?.toString() || '');
                formDataToSend.append('email', formData.email || '');
                formDataToSend.append('phoneNumber', formData.phoneNumber || '');
                if (formData.dateOfBirth) {
                    formDataToSend.append('dateOfBirth', formData.dateOfBirth);
                }
            } else if (userType === 'hospital') {
                formDataToSend.append('cif', formData.cif || '');
                formDataToSend.append('name', formData.name || '');
                formDataToSend.append('address', formData.address || '');
                formDataToSend.append('postalCode', formData.postalCode || '');
                formDataToSend.append('email', formData.email || '');
                formDataToSend.append('phoneNumber', formData.phoneNumber || '');
            }

            // Append image if selected
            if (imageUpload.imageFile) {
                formDataToSend.append('image', imageUpload.imageFile);
            }

            const endpoint = userType === 'bloodDonor'
                ? `/bloodDonor/${user?.id}`
                : `/hospital?id=${user?.id}`;

            await axiosInstance.put(endpoint, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });

            // Change password if provided
            if (passwordChange.showPasswordFields && passwordChange.passwordData.currentPassword && passwordChange.passwordData.newPassword) {
                try {
                    await passwordChange.changePassword();
                    setMessage({ type: 'success', text: 'Perfil y contraseña actualizados correctamente' });
                } catch (passwordError: any) {
                    console.error('Password change error:', passwordError);
                    setMessage({
                        type: 'error',
                        text: passwordError.response?.data?.error || 'Error al cambiar la contraseña'
                    });
                    setLoading(false);
                    return;
                }
            }

            // Refresh user data
            setMessage({ type: 'success', text: 'Perfil actualizado correctamente. Actualizando...' });

            setTimeout(async () => {
                try {
                    await refreshUser();
                    onClose();
                } catch (refreshError) {
                    console.error('Error refreshing user data:', refreshError);
                    window.location.reload();
                }
            }, 1000);
        } catch (error: any) {
            console.error('Update error:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Error al actualizar el perfil'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        setLoading(true);
        await deleteAccount.handleDeleteAccount(
            () => setMessage({ type: 'success', text: 'Cuenta eliminada exitosamente. Redirigiendo...' }),
            (errorMessage) => setMessage({ type: 'error', text: errorMessage })
        );
        setLoading(false);
    };

    if (!isOpen) return null;

    // Get user initial for profile image
    const userInitial = userType === 'bloodDonor'
        ? formData.firstName?.charAt(0) || ''
        : formData.name?.charAt(0) || '';

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                    onClick={onClose}
                ></div>

                {/* Modal */}
                <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">Editar Perfil</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6">
                        {/* Profile Image Upload */}
                        <ProfileImageUpload
                            imagePreview={imageUpload.imagePreview}
                            userType={userType}
                            userInitial={userInitial}
                            onImageChange={imageUpload.handleImageChange}
                        />

                        {/* Conditional: Donor or Hospital Fields */}
                        {userType === 'bloodDonor' ? (
                            <DonorFields
                                formData={formData}
                                errors={errors}
                                onInputChange={handleInputChange}
                            />
                        ) : (
                            <HospitalFields
                                formData={formData}
                                errors={errors}
                                onInputChange={handleInputChange}
                            />
                        )}

                        {/* Password Change Section */}
                        <PasswordChangeSection
                            showPasswordFields={passwordChange.showPasswordFields}
                            passwordData={passwordChange.passwordData}
                            passwordErrors={passwordChange.passwordErrors}
                            onToggle={() => passwordChange.setShowPasswordFields(!passwordChange.showPasswordFields)}
                            onPasswordChange={passwordChange.handlePasswordChange}
                        />

                        {/* Buttons */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </div>

                        {/* Danger Zone */}
                        <DangerZone onDeleteClick={deleteAccount.showModal} />
                    </form>
                </div>
            </div>

            {/* Toast Message - Positioned at bottom of screen, above everything */}
            {message && (
                <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[60] max-w-md w-full mx-4">
                    <div className={`p-4 rounded-lg shadow-lg ${message.type === 'success' ? 'bg-green-100 text-green-800 border-2 border-green-300' : 'bg-red-100 text-red-800 border-2 border-red-300'
                        }`}>
                        <div className="flex items-center gap-2">
                            {message.type === 'success' ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                            <span className="font-medium">{message.text}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteAccountModal
                isOpen={deleteAccount.showDeleteConfirm}
                deleteConfirmText={deleteAccount.deleteConfirmText}
                loading={loading}
                onConfirmTextChange={deleteAccount.setDeleteConfirmText}
                onCancel={deleteAccount.hideModal}
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
};

export default EditProfileModal;
