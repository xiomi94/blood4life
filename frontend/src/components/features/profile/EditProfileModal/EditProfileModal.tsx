import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDeleteAccount } from './useDeleteAccount';
import { ProfileImageUpload } from './ProfileImageUpload';
import { DonorFields } from './DonorFields';
import { HospitalFields } from './HospitalFields';
import { AdminFields } from './AdminFields';
import { PasswordChangeSection } from './PasswordChangeSection';
import { DeleteAccountModal } from './DeleteAccountModal';
import { DangerZone } from './DangerZone';
import { useEditProfile } from './useEditProfile';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
    // Main hook handling form logic
    const {
        userType,
        formData,
        errors,
        loading,
        message,
        imageUpload,
        passwordChange,
        handleInputChange,
        handleSubmit,
        setMessage
    } = useEditProfile(onClose);

    const { t } = useTranslation();

    // Delete account hook (kept separate as it's a distinct destructive action)
    const deleteAccount = useDeleteAccount(userType);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';

            return () => {
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
    }, [isOpen, setMessage]);

    const handleDeleteConfirm = async () => {
        await deleteAccount.handleDeleteAccount(
            () => setMessage({ type: 'success', text: 'Cuenta eliminada exitosamente. Redirigiendo...' }),
            (errorMessage) => setMessage({ type: 'error', text: errorMessage })
        );
    };

    if (!isOpen) return null;

    // Only allow bloodDonor, hospital and admin users to edit profile
    if (userType !== 'bloodDonor' && userType !== 'hospital' && userType !== 'admin') {
        return null;
    }

    // Get user initial for profile image
    const userInitial = userType === 'bloodDonor'
        ? formData.firstName?.charAt(0) || ''
        : userType === 'hospital'
            ? formData.name?.charAt(0) || ''
            : 'A';

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                    onClick={onClose}
                ></div>

                {/* Modal */}
                <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('profile.editTitle')}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6">
                        {/* Profile Image - Hidden for Admin */}
                        {userType !== 'admin' && (
                            <ProfileImageUpload
                                imagePreview={imageUpload.imagePreview}
                                userInitial={userInitial}
                                onImageChange={imageUpload.handleImageChange}
                            />
                        )}

                        {/* Conditional: Donor, Hospital or Admin Fields */}
                        {userType === 'bloodDonor' ? (
                            <DonorFields
                                formData={formData}
                                errors={errors}
                                onInputChange={handleInputChange}
                            />
                        ) : userType === 'hospital' ? (
                            <HospitalFields
                                formData={formData}
                                errors={errors}
                                onInputChange={handleInputChange}
                            />
                        ) : (
                            <AdminFields
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
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                {t('profile.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? t('profile.saving') : t('profile.saveChanges')}
                            </button>
                        </div>

                        {/* Danger Zone - Hidden for Admin */}
                        {userType !== 'admin' && (
                            <DangerZone onDeleteClick={deleteAccount.showModal} />
                        )}
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
