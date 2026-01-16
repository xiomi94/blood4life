import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../common/ui/Button/Button';
import FormField from '../../../common/forms/FormField/FormField';
import SelectField from '../../../common/forms/SelectField/SelectField';
import DatePicker from '../../../common/forms/DatePicker/DatePicker';
import type { BloodDonor } from "../../../../models/BloodDonor";

interface BloodDonorFormProps {
    bloodDonor: BloodDonor | null;
    onSubmit: (data: BloodDonor) => void;
    onCancel: () => void;
}

const BloodDonorForm: React.FC<BloodDonorFormProps> = ({ bloodDonor, onSubmit, onCancel }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<Partial<BloodDonor>>({
        firstName: '',
        lastName: '',
        dni: '',
        email: '',
        phoneNumber: '',
        gender: '',
        bloodType: undefined,
        dateOfBirth: ''
    });

    useEffect(() => {
        if (bloodDonor) {
            setFormData({
                ...bloodDonor,
                dateOfBirth: bloodDonor.dateOfBirth ? new Date(bloodDonor.dateOfBirth).toISOString().split('T')[0] : ''
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                dni: '',
                email: '',
                phoneNumber: '',
                gender: '',
                bloodType: undefined,
                dateOfBirth: ''
            });
        }
    }, [bloodDonor]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData as BloodDonor);
    };

    const genderOptions = [
        { value: '', label: t('auth.register.bloodDonor.genderSelect') },
        { value: 'Masculino', label: t('auth.register.bloodDonor.male') },
        { value: 'Femenino', label: t('auth.register.bloodDonor.female') },
        { value: 'Prefiero no decirlo', label: t('auth.register.bloodDonor.preferNotToSay') }
    ];

    const bloodTypeOptions = [
        { value: '', label: t('auth.register.bloodDonor.bloodTypeSelect') },
        { value: 'A+', label: 'A+' },
        { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' },
        { value: 'B-', label: 'B-' },
        { value: 'AB+', label: 'AB+' },
        { value: 'AB-', label: 'AB-' },
        { value: 'O+', label: 'O+' },
        { value: 'O-', label: 'O-' }
    ];

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    type="text"
                    id="dni"
                    name="dni"
                    label={t('auth.register.bloodDonor.dni')}
                    value={formData.dni || ''}
                    onChange={handleInputChange}
                    required
                />
                <FormField
                    type="text"
                    id="firstName"
                    name="firstName"
                    label={t('auth.register.bloodDonor.firstName')}
                    value={formData.firstName || ''}
                    onChange={handleInputChange}
                    required
                />
                <FormField
                    type="text"
                    id="lastName"
                    name="lastName"
                    label={t('auth.register.bloodDonor.lastName')}
                    value={formData.lastName || ''}
                    onChange={handleInputChange}
                    required
                />
                <FormField
                    type="email"
                    id="email"
                    name="email"
                    label={t('auth.register.bloodDonor.email')}
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    required
                />
                <FormField
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    label={t('auth.register.bloodDonor.phone')}
                    value={formData.phoneNumber || ''}
                    onChange={handleInputChange}
                    required
                />
                <SelectField
                    id="gender"
                    name="gender"
                    label={t('auth.register.bloodDonor.gender')}
                    value={formData.gender || ''}
                    onChange={handleSelectChange}
                    required
                    options={genderOptions}
                />
                <SelectField
                    id="bloodType"
                    name="bloodType"
                    label={t('auth.register.bloodDonor.bloodType')}
                    value={formData.bloodType?.type || ''}
                    onChange={handleSelectChange}
                    required
                    options={bloodTypeOptions}
                />
                <DatePicker
                    id="dateOfBirth"
                    name="dateOfBirth"
                    label={t('auth.register.bloodDonor.dateOfBirth')}
                    value={formData.dateOfBirth || ''}
                    onChange={(e) => handleInputChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}
                    required
                />
            </div>

            <div className="flex flex-row justify-end gap-3 mt-4">
                <Button type="button" variant="gray" onClick={onCancel}>
                    {t('common.cancel')}
                </Button>
                <Button type="submit">
                    {t('common.save')}
                </Button>
            </div>
        </form>
    );
};

export default BloodDonorForm;
