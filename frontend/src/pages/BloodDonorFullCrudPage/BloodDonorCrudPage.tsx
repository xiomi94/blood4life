import { useEffect, useState } from 'react';
import { bloodDonorService } from "../../services/bloodDonorService.ts";
import type { BloodDonor } from "../../models/BloodDonor.ts";
import BloodDonorTableItem from "../../components/BloodDonorTableIItem/BloodDonorTableItem.tsx";
import BloodDonorForm from "../../components/BloodDonorForm/BloodDonorForm.tsx";

function BloodDonorCrudPage() {

  const [bloodDonors, setBloodDonors] = useState<BloodDonor[]>([]);
  const [selectedBloodDonor, setSelectedBloodDonor] = useState<null | BloodDonor>(null);

  const onBloodDonorTableItemClickEdit = (bloodDonor: BloodDonor) => {
    setSelectedBloodDonor(bloodDonor);
  };

  const onBloodDonorTableItemClickDelete = (bloodDonor: BloodDonor) => {
    bloodDonorService.delete(bloodDonor.id!).then(() => {
      const newState = bloodDonors.filter(d => d.id !== bloodDonor.id);
      setBloodDonors(newState);
    });
  };

  const bloodDonorFormOnSubmit = (data: BloodDonor) => {
    console.log(data);
  };

  const bloodDonorFormOnCancel = () => {
    setSelectedBloodDonor(null);
  };

  const bloodDonorRenderList = bloodDonors.map((donor) => (
    <BloodDonorTableItem
      key={donor.id}
      bloodDonor={donor}
      onClickEdit={onBloodDonorTableItemClickEdit}
      onClickDelete={onBloodDonorTableItemClickDelete}
    />
  ));

  useEffect(() => {
    bloodDonorService.getAll().then((response) => {
      setBloodDonors(response.data);
    });
  }, []);

  return (
    <div className="min-w-6xl max-w-6xl mx-auto">

      <div className="bg-white shadow p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-6">
          {selectedBloodDonor ? "Editar donante" : "Crear nuevo donante"}
        </h2>

        <BloodDonorForm
          onCancel={bloodDonorFormOnCancel}
          onSubmit={bloodDonorFormOnSubmit}
          bloodDonor={selectedBloodDonor}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Lista de donantes</h2>

          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-3 py-1.5 bg-white border rounded shadow-sm
                       text-sm hover:bg-gray-100"
          >
            🔄 Actualizar
          </button>
        </div>

        {bloodDonors.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            <div className="text-5xl mb-4">📋</div>
            <p>No hay donantes registrados</p>
          </div>
        ) : (
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-50">
            <tr>
              <th className="border px-3 py-2">DNI</th>
              <th className="border px-3 py-2">Nombre</th>
              <th className="border px-3 py-2">Apellidos</th>
              <th className="border px-3 py-2">Acciones</th>
            </tr>
            </thead>
            <tbody>{bloodDonorRenderList}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default BloodDonorCrudPage;
