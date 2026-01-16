import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
}

const ImageUpload = ({ onImageChange }: ImageUploadProps) => {
  const { t } = useTranslation();
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
        toast.error(t('auth.register.imageUpload.invalidFormat'));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('auth.register.imageUpload.tooLarge'));
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
    <div className="flex items-center justify-center w-full">
      <div
        className="flex flex-col w-full md:w-5/12 items-center justify-center space-y-4 p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mx-4 md:mx-0"
      >
        <h3 className="font-poppins font-semibold text-body-lg md:text-h3 text-gray-800 dark:text-white text-center">{t('auth.register.imageUpload.title')}</h3>
        <div className="flex flex-col items-center space-y-4 w-full">
          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt={t('auth.register.imageUpload.preview')}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-100 dark:border-gray-600 shadow-md"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-transform hover:scale-110"
                aria-label={t('auth.register.imageUpload.remove')}
              >
                ×
              </button>
            </div>
          ) : (
            <button
              onClick={triggerFileInput}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-500 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
              type="button"
              aria-label={t('auth.register.imageUpload.select')}
            >
              <div className="text-center">
                <svg
                  className="w-6 h-6 md:w-8 md:h-8 text-gray-400 dark:text-gray-300 mx-auto mb-1 md:mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="font-roboto text-caption text-gray-600 dark:text-gray-300 font-medium">{t('auth.register.imageUpload.uploadButton')}</span>
              </div>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg, image/jpg, image/png"
            onChange={handleImageChange}
            className="hidden"
            id="profile-photo-input"
            aria-describedby="file-requirements"
          />
          <div id="file-requirements" className="text-center">
            <p className="font-roboto text-caption text-gray-600 dark:text-gray-400">
              {t('auth.register.imageUpload.formats')}
            </p>
            <p className="font-roboto text-caption text-gray-600 dark:text-gray-400">
              {t('auth.register.imageUpload.maxSize')}
            </p>
          </div>
          {previewUrl && (
            <div className="text-center">
              <p className="font-roboto text-body-sm text-green-600 dark:text-green-400 font-medium">
                {t('auth.register.imageUpload.ready')}
              </p>
              <p className="font-roboto text-caption text-gray-500 dark:text-gray-400 mt-1">
                {t('auth.register.imageUpload.saveInfo')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;