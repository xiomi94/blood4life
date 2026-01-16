import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BloodDonorRegisterForm from '../../components/features/auth/BloodDonorRegisterForm/BloodDonorRegisterForm';
import Modal from '../../components/common/feedback/Modal/Modal';

const BloodDonorRegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showModal = (title: string, message: string, type: 'success' | 'error' | 'info') => {
    setModal({ isOpen: true, title, message, type });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleSuccess = (message: string) => {
    showModal(t('auth.register.modal.successTitle'), message, 'success');
  };

  const handleError = (error: string) => {
    showModal(t('auth.register.modal.errorTitle'), error, 'error');
  };

  return (
    <main className="flex flex-col flex-grow items-center px-4 sm:px-6 md:px-8 lg:px-12 py-6">
      <div className="w-full max-w-6xl flex flex-col gap-6 md:gap-8">
        {/* Título */}
        <div className="text-center">
          <h2 className="font-poppins font-semibold text-h3 sm:text-h2 md:text-h1 text-gray-800 dark:text-white mb-2">
            {t('auth.register.formTitle')}
          </h2>
        </div>

        <BloodDonorRegisterForm
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={closeModal}
      />
    </main>
  );
};

export default BloodDonorRegisterPage;