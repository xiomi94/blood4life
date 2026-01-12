import type { BloodDonor } from "../../../../models/BloodDonor";

interface Props {
  bloodDonor: BloodDonor;
  onClickEdit: (bloodDonor: BloodDonor) => void;
  onClickDelete: (bloodDonor: BloodDonor) => void;
}

function BloodDonorTableItem({ bloodDonor, onClickEdit, onClickDelete }: Props) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{bloodDonor.dni}</div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{bloodDonor.firstName}</div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{bloodDonor.lastName}</div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          {/* Botón Editar */}
          <button
            onClick={() => onClickEdit(bloodDonor)}
            className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Editar
          </button>

          {/* Botón Eliminar */}
          <button
            onClick={() => onClickDelete(bloodDonor)}
            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}

export default BloodDonorTableItem;
