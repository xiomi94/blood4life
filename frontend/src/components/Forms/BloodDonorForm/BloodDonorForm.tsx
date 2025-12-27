import type { BloodDonor } from "../../../models/BloodDonor";
import { useEffect, useState } from "react";
import React from "react";

interface Props {
  bloodDonor?: BloodDonor | null;
  onSubmit: (data: BloodDonor) => void;
  onCancel: () => void;
}

export default function BloodDonorForm({ bloodDonor, onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState<BloodDonor>({
    dni: "",
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    password: "",
  });

  useEffect(() => {
    if (bloodDonor) {
      setFormData({ ...bloodDonor });
    } else {
      setFormData({
        dni: "",
        firstName: "",
        lastName: "",
        gender: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        password: "",
      });
    }
  }, [bloodDonor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const showPasswordField = !bloodDonor;
  const showCancelButton = !!bloodDonor;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Grid con 2 columnas */}
      <div className="grid grid-cols-2 gap-4">

        {/* DNI */}
        <div>
          <label className="block text-sm font-medium text-gray-700">DNI</label>
          <input
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            type="text"
            required
            className="mt-1 w-full border rounded-md px-3 py-2"
            placeholder="DNI"
          />
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="mt-1 w-full border rounded-md px-3 py-2"
            placeholder="Nombre"
          />
        </div>

        {/* Apellidos */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Apellidos</label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="mt-1 w-full border rounded-md px-3 py-2"
            placeholder="Apellidos"
          />
        </div>

        {/* Género */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Género</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="mt-1 w-full border rounded-md px-3 py-2"
          >
            <option value="">Seleccione género</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="N">No especificar</option>
          </select>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            required
            className="mt-1 w-full border rounded-md px-3 py-2"
            placeholder="Email"
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="mt-1 w-full border rounded-md px-3 py-2"
            placeholder="Teléfono"
          />
        </div>

        {/* Fecha de nacimiento */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de nacimiento</label>
          <input
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            type="date"
            required
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Contraseña (solo en creación) */}
        {showPasswordField && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              required
              className="mt-1 w-full border rounded-md px-3 py-2"
              placeholder="Contraseña"
            />
          </div>
        )}

      </div>

      {/* BOTONES */}
      <div className="flex justify-end gap-3 pt-2">
        {showCancelButton && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </button>
        )}

        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {bloodDonor ? "Actualizar donante" : "Registrar donante"}
        </button>
      </div>
    </form>
  );
}
