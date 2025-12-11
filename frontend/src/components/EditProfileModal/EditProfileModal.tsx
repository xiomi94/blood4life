import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
    const { user, userType } = useAuth();
    const [formData, setFormData] = useState<any>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        if (user && userType) {
            // Pre-fill form with current user data
            setFormData({
                ...user,
                bloodTypeId: user.bloodType?.id || '',
            });

            // Set image preview if user has image
            if (user.imageName) {
                setImagePreview(`/images/${user.imageName}`);
            }
        }
    }, [user, userType]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const formDataToSend = new FormData();

            if (userType === 'bloodDonor') {
                // For blood donor, append all fields
                formDataToSend.append('dni', formData.dni || '');
                formDataToSend.append('firstName', formData.firstName || '');
                formDataToSend.append('lastName', formData.lastName || '');
                formDataToSend.append('gender', formData.gender || '');
                formDataToSend.append('bloodTypeId', formData.bloodType?.id?.toString() || '');
                formDataToSend.append('email', formData.email || '');
                formDataToSend.append('phoneNumber', formData.phoneNumber || '');
                if (formData.dateOfBirth) {
                    formDataToSend.append('dateOfBirth', formData.dateOfBirth);
                }
            } else if (userType === 'hospital') {
                // For hospital, append all fields
                formDataToSend.append('id', user?.id?.toString() || '');
                formDataToSend.append('cif', formData.cif || '');
                formDataToSend.append('name', formData.name || '');
                formDataToSend.append('address', formData.address || '');
                formDataToSend.append('email', formData.email || '');
                formDataToSend.append('phoneNumber', formData.phoneNumber || '');
            }

            // Append image if selected
            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }

            const endpoint = userType === 'bloodDonor'
                ? `/bloodDonor/${user?.id}`
                : `/hospital`;

            await axiosInstance.put(endpoint, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });

            // Change password if provided
            if (showPasswordFields && passwordData.currentPassword && passwordData.newPassword) {
                // Validate password confirmation
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                    setMessage({ type: 'error', text: 'Las contraseñas nuevas no coinciden' });
                    setLoading(false);
                    return;
                }

                // Validate password requirements
                if (passwordData.newPassword.length < 8) {
                    setMessage({ type: 'error', text: 'La contraseña debe tener al menos 8 caracteres' });
                    setLoading(false);
                    return;
                }
                if (passwordData.newPassword.length > 32) {
                    setMessage({ type: 'error', text: 'La contraseña no puede exceder 32 caracteres' });
                    setLoading(false);
                    return;
                }
                if (!/(?=.*[a-z])/.test(passwordData.newPassword)) {
                    setMessage({ type: 'error', text: 'La contraseña debe contener al menos una minúscula' });
                    setLoading(false);
                    return;
                }
                if (!/(?=.*[A-Z])/.test(passwordData.newPassword)) {
                    setMessage({ type: 'error', text: 'La contraseña debe contener al menos una mayúscula' });
                    setLoading(false);
                    return;
                }
                if (!/(?=.*\d)/.test(passwordData.newPassword)) {
                    setMessage({ type: 'error', text: 'La contraseña debe contener al menos un número' });
                    setLoading(false);
                    return;
                }
                if (/\s/.test(passwordData.newPassword)) {
                    setMessage({ type: 'error', text: 'La contraseña no puede contener espacios' });
                    setLoading(false);
                    return;
                }
                if (/(.)\1{3,}/.test(passwordData.newPassword)) {
                    setMessage({ type: 'error', text: 'Demasiados caracteres repetidos' });
                    setLoading(false);
                    return;
                }

                try {
                    const passwordFormData = new FormData();
                    passwordFormData.append('currentPassword', passwordData.currentPassword);
                    passwordFormData.append('newPassword', passwordData.newPassword);

                    const passwordEndpoint = userType === 'bloodDonor'
                        ? `/bloodDonor/change-password`
                        : `/hospital/change-password`;

                    await axiosInstance.post(passwordEndpoint, passwordFormData);
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

            // Refresh user data without full page reload
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 1500);
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

    if (!isOpen) return null;

    return (
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
                    {/* Image Upload */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Foto de Perfil
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white text-2xl font-bold">
                                        {userType === 'bloodDonor'
                                            ? formData.firstName?.charAt(0)
                                            : formData.name?.charAt(0)}
                                    </span>
                                )}
                            </div>
                            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                                Cambiar foto
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Donor Fields */}
                    {userType === 'bloodDonor' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                                <input
                                    type="text"
                                    name="dni"
                                    value={formData.dni || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">Formato: 12345678X</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                                    disabled
                                    readOnly
                                />
                                <p className="mt-1 text-xs text-gray-500">El email no se puede modificar</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <p className="mt-1 text-xs text-gray-500">Formato: +34 123 456 789 (opcional)</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
                                <select
                                    name="gender"
                                    value={formData.gender || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seleccionar género</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                    <option value="No binario">No binario</option>
                                    <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Hospital Fields */}
                    {userType === 'hospital' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CIF</label>
                                <input
                                    type="text"
                                    name="cif"
                                    value={formData.cif || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">Formato: A12345678</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">Dirección completa del hospital</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                                    disabled
                                    readOnly
                                />
                                <p className="mt-1 text-xs text-gray-500">El email no se puede modificar</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">Formato: +34 123 456 789</p>
                            </div>
                        </div>
                    )}

                    {/* Password Change Section */}
                    <div className="mt-6 border-t border-gray-200 pt-6">
                        <button
                            type="button"
                            onClick={() => setShowPasswordFields(!showPasswordFields)}
                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                        >
                            <svg
                                className={`w-4 h-4 transition-transform ${showPasswordFields ? 'rotate-90' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                            Cambiar contraseña
                        </button>

                        <div
                            className={`grid grid-cols-1 gap-4 mt-4 overflow-hidden transition-all duration-500 ease-in-out ${showPasswordFields ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ingresa tu contraseña actual"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Mínimo 8 caracteres"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Debe contener: mayúscula, minúscula, número (8-32 caracteres)
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nueva Contraseña</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Repite la nueva contraseña"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    {message && (
                        <div className={`mt-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {message.text}
                        </div>
                    )}

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
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
