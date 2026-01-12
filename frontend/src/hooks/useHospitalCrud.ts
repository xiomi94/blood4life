import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { Hospital, HospitalFormData } from '../models/Hospital.ts';
import { hospitalService } from '../services/hospitalService.ts';

export const useHospitalCrud = () => {
  const [hospitales, setHospitales] = useState<Hospital[]>([]);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [formData, setFormData] = useState<HospitalFormData>({
    cif: '',
    name: '',
    address: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  // Validaciones
  const validateCreate = (): boolean => {
    if (!formData.cif || !formData.name || !formData.address || !formData.password) {
      setError('CIF, nombre, dirección y contraseña son obligatorios');
      return false;
    }
    return true;
  };

  const validateUpdate = (): boolean => {
    if (!editingHospital?.id) {
      setError('No hay un hospital seleccionado para editar');
      return false;
    }
    return validateCreate();
  };

  const validateDelete = (id: number | undefined): boolean => {
    if (id === undefined) {
      setError('ID del hospital no válido');
      return false;
    }
    return true;
  };

  // Operaciones CRUD
  const loadHospitales = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await hospitalService.getHospitales();
      setHospitales(data);
    } catch (err) {
      setError('Error al cargar los hospitales');
      toast.error('Error al cargar los hospitales');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateCreate()) return;

    setLoading(true);
    try {
      const newHospital = await hospitalService.createHospital(formData);
      setHospitales(prev => [...prev, newHospital]);
      setSuccess('Hospital creado exitosamente');
      toast.success('Hospital creado exitosamente');
      resetForm();
    } catch (err) {
      setError('Error al crear el hospital');
      toast.error('Error al crear el hospital');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateUpdate()) return;

    setLoading(true);
    try {
      const hospitalToUpdate: Hospital = {
        id: editingHospital!.id,
        ...formData
      };

      const result = await hospitalService.updateHospital(hospitalToUpdate);

      if ('message' in result) {
        setError(result.message);
      } else {
        setHospitales(prev =>
          prev.map(hosp => hosp.id === result.id ? result : hosp)
        );
        setSuccess('Hospital actualizado exitosamente');
        toast.success('Hospital actualizado exitosamente');
        resetForm();
      }
    } catch (err) {
      setError('Error al actualizar el hospital');
      toast.error('Error al actualizar el hospital');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hospital: Hospital) => {
    setEditingHospital(hospital);
    setFormData({
      cif: hospital.cif,
      name: hospital.name,
      address: hospital.address,
      email: hospital.email,
      phoneNumber: hospital.phoneNumber,
      password: hospital.password
    });
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id: number | undefined) => {
    if (!validateDelete(id)) return;

    if (!window.confirm('¿Estás seguro de eliminar este hospital?')) return;

    setLoading(true);
    setError('');
    try {
      await hospitalService.deleteHospital(id!);
      setHospitales(prev => prev.filter(hosp => hosp.id !== id));
      setSuccess('Hospital eliminado exitosamente');
      toast.success('Hospital eliminado exitosamente');
    } catch (err) {
      setError('Error al eliminar el hospital');
      toast.error('Error al eliminar el hospital');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      cif: '',
      name: '',
      address: '',
      email: '',
      phoneNumber: '',
      password: ''
    });
    setEditingHospital(null);
    setShowPassword(false);
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Efectos
  useEffect(() => {
    loadHospitales();
  }, []);

  return {
    // Estado
    hospitales,
    editingHospital,
    loading,
    error,
    success,
    showPassword,
    formData,

    // Setters
    setShowPassword,

    // Métodos
    loadHospitales,
    handleInputChange,
    handleCreate,
    handleUpdate,
    handleEdit,
    handleDelete,
    resetForm
  };
};