import { useHospitalCrud } from '../../hooks/useHospitalCrud.ts';
import { Link } from "react-router";
import Edit from "../../assets/images/LogoShadow.webp"
import Delete from "../../assets/images/trashcan-icon.webp"

function HospitalCrudPage() {
  const {
    // Estado
    hospitales,
    editingHospital,
    loading,
    showPassword,
    formData,

    setShowPassword,

    // Métodos
    loadHospitales,
    handleInputChange,
    handleCreate,
    handleUpdate,
    handleEdit,
    handleDelete,
    resetForm
  } = useHospitalCrud();

  return (
    <>
      <div className="flex flex-col w-full h-full items-center">
        <div className="flex flex-col w-11/12 h-fit pt-10">
          <form
            onSubmit={editingHospital ? handleUpdate : handleCreate}
            className="flex flex-col align-center p-6 bg-gray-200 rounded-2xl drop-shadow"
          >
            <h2 className="font-poppins font-semibold text-body-lg sm:text-h3 text-gray-800 mb-6">
              {editingHospital ? 'Editar hospital' : 'Crear nuevo hospital'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              <div className="w-full">
                <label htmlFor="cif" className="block text-md font-bold text-black mb-1">
                  CIF
                </label>
                <input
                  type="text"
                  id="cif"
                  name="cif"
                  value={formData.cif}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-3/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 bg-white drop-shadow"
                  placeholder="Ingrese el CIF *"
                />
              </div>
              <div className="flex justify-center">
                <div className="w-3/4"> {/* Mismo ancho que el input */}
                  <label htmlFor="name" className="w-fit block text-md font-bold text-black mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 bg-white drop-shadow"
                    placeholder="Ingrese el nombre *"
                  />
                </div>
              </div>
              <div className="flex flex-row justify-end">
                <div className="flex flex-col justify-end w-3/4">
                  <label htmlFor="address" className="block text-md font-bold text-black mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 bg-white drop-shadow"
                    placeholder="Ingrese la dirección *"
                  />
                </div>
              </div>
              <div className="w-full">
                <label htmlFor="email" className="block text-md font-bold text-black mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-3/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 bg-white drop-shadow"
                  placeholder="Ingrese el email"
                />
              </div>
              <div className="flex justify-center">
                <div className="w-3/4"> {/* Mismo ancho que el input */}
                  <label htmlFor="phoneNumber" className="block text-md font-bold text-black mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 bg-white drop-shadow"
                    placeholder="Ingrese el teléfono"
                  />
                </div>
              </div>
              <div className="flex flex-row justify-end">
                <div className="flex flex-col justify-end w-3/4">
                  <label htmlFor="password" className="block text-md font-bold text-black mb-1">
                    Contraseña
                  </label>
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 bg-white drop-shadow"
                      placeholder="Ingrese la contraseña *"
                    />
                    <div className="absolute flex items-center justify-end w-full inset-0 pr-3">
                      <button
                        type="button"
                        className=""
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed drop-shadow"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>) : (editingHospital ? 'Actualizar hospital' : 'Crear hospital')}
              </button>

              {editingHospital && (
                <button type="button" onClick={resetForm} disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="flex flex-col w-11/12 h-fit pt-10 drop-shadow">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-poppins font-semibold text-body-lg sm:text-h3 text-gray-800">Lista de hospitales</h2>
              <button onClick={loadHospitales} disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualizar
              </button>
            </div>

            {loading && hospitales.length === 0 ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="font-roboto text-body-sm">Cargando hospitales...</span>
                </div>
              </div>
            ) : hospitales.length === 0 ? (
              <div className="p-8 text-center font-roboto text-body-sm text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="mt-2">No hay hospitales registrados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 font-roboto text-body-sm md:text-body">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">CIF</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Dirección</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Teléfono</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {hospitales.map((hospital) => (
                      <tr key={hospital.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-bold text-gray-900">{hospital.cif}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-bold text-gray-900">{hospital.name}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-bold text-gray-900">{hospital.address}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-bold text-gray-900">{hospital.email}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-bold text-gray-900">{hospital.phoneNumber}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                          <div className="flex space-x-2">
                            <button onClick={() => handleEdit(hospital)} disabled={loading} className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 cursor-pointer"><img src={Edit} alt="Editar" className="w-5 h-5" /></button>
                            <button onClick={() => handleDelete(hospital.id)} disabled={loading} className="text-red-600 hover:text-red-900 disabled:opacity-50 cursor-pointer"><img src={Delete} alt="Eliminar" className="w-5 h-5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div
            className="flex flex-col items-center m-5">
            <li className="list-none">
              <Link to="/index">
                <button
                  type="button"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Inicio
                </button>
              </Link>
            </li>
          </div>
        </div>
      </div >
    </>
  )
}

export default HospitalCrudPage;