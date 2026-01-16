interface ProfileImageUploadProps {
    imagePreview: string | null;
    userInitial: string;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}

/**
 * Component for uploading and displaying profile image
 * - Shows current image or user initial
 * - 100% shared between donor and hospital
 */
export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
    imagePreview,
    userInitial,
    onImageChange,
    disabled = false
}) => {
    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                Foto de Perfil
            </label>
            <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-sm">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-white text-3xl font-bold">
                            {userInitial}
                        </span>
                    )}
                </div>
                {!disabled && (
                    <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
                        Cambiar foto
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onImageChange}
                            className="hidden"
                        />
                    </label>
                )}
            </div>
        </div>
    );
};
