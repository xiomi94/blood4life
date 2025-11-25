import { useState, useRef, useEffect } from 'react';

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
}

const ImageUpload = ({ onImageChange }: ImageUploadProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onImageChange(selectedImage);
  }, [selectedImage, onImageChange]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Por favor, selecciona una imagen válida (JPG o PNG)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }

      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col w-full items-center space-y-4 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800">Foto de Perfil</h3>
      <div className="flex flex-col items-center space-y-4 w-full">
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-md"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-lg"
            >
              ×
            </button>
          </div>
        ) : (
          <div
            onClick={triggerFileInput}
            className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="text-center">
              <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-xs text-gray-500">Subir foto</span>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg, image/jpg, image/png"
          onChange={handleImageChange}
          className="hidden"
        />
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Formatos: JPG, PNG
          </p>
          <p className="text-xs text-gray-500">
            Máximo: 5MB
          </p>
        </div>
        {previewUrl && (
          <div className="text-center">
            <p className="text-sm text-green-600 font-medium">
              ✓ Imagen lista para guardar
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Se guardará al registrar el hospital
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;