interface HospitalFieldsProps {
    formData: any;
    errors: any;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

/**
 * Component with all hospital-specific form fields
 * - CIF, name, address, email, phone
 */
export const HospitalFields: React.FC<HospitalFieldsProps> = ({ formData, errors, onInputChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CIF */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CIF</label>
                <input
                    type="text"
                    name="cif"
                    value={formData.cif || ''}
                    onChange={onInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.cif ? 'border-red-500' : 'border-gray-300'
                        }`}
                    required
                />
                {errors.cif ? (
                    <p className="mt-1 text-xs text-red-500">{errors.cif}</p>
                ) : (
                    <p className="mt-1 text-xs text-gray-500">Formato: A12345678</p>
                )}
            </div>

            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={onInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                    required
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={onInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                    required
                />
                {errors.address ? (
                    <p className="mt-1 text-xs text-red-500">{errors.address}</p>
                ) : (
                    <p className="mt-1 text-xs text-gray-500">Dirección completa del hospital</p>
                )}
            </div>

            {/* Postal Code */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode || ''}
                    onChange={onInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.postalCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                    required
                />
                {errors.postalCode ? (
                    <p className="mt-1 text-xs text-red-500">{errors.postalCode}</p>
                ) : (
                    <p className="mt-1 text-xs text-gray-500">Formato: 5 dígitos (ej: 35001)</p>
                )}
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
                    required
                />
                {errors.phoneNumber ? (
                    <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>
                ) : (
                    <p className="mt-1 text-xs text-gray-500">Formato: +34 123 456 789</p>
                )}
            </div>
        </div>
    );
};
