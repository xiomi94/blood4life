interface DonorFieldsProps {
    formData: any;
    errors: any;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

/**
 * Component with all donor-specific form fields
 * - DNI, firstName, lastName, email, phone, gender, bloodType
 */
export const DonorFields: React.FC<DonorFieldsProps> = ({ formData, errors, onInputChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* DNI */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                <input
                    type="text"
                    name="dni"
                    value={formData.dni || ''}
                    onChange={onInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.dni ? 'border-red-500' : 'border-gray-300'
                        }`}
                    required
                />
                {errors.dni ? (
                    <p className="mt-1 text-xs text-red-500">{errors.dni}</p>
                ) : (
                    <p className="mt-1 text-xs text-gray-500">Formato: 12345678X</p>
                )}
            </div>

            {/* First Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={onInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                    required
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={onInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                    required
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
            </div>

            {/* Email (readonly) */}
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

            {/* Phone */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={onInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.phoneNumber ? (
                    <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>
                ) : (
                    <p className="mt-1 text-xs text-gray-500">Formato: +34 123 456 789 (opcional)</p>
                )}
            </div>

            {/* Gender */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
                <select
                    name="gender"
                    value={formData.gender || ''}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Seleccionar género</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="No binario">No binario</option>
                    <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                </select>
            </div>

            {/* Blood Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Sangre</label>
                <select
                    name="bloodTypeId"
                    value={formData.bloodTypeId || ''}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                >
                    <option value="">Seleccionar tipo de sangre</option>
                    <option value="1">A+</option>
                    <option value="2">A-</option>
                    <option value="3">B+</option>
                    <option value="4">B-</option>
                    <option value="5">AB+</option>
                    <option value="6">AB-</option>
                    <option value="7">O+</option>
                    <option value="8">O-</option>
                </select>
            </div>
        </div>
    );
};
