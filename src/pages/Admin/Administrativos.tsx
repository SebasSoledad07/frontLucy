import { FaEdit, FaRegPlusSquare } from 'react-icons/fa';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useAdministrativosContext } from '../../Context/AdministrativosContext';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const Administrativos: React.FC = () => {
  const { administrativos, roles, fetchAdministrativos, fetchRoles } =
    useAdministrativosContext();

  useEffect(() => {
    fetchAdministrativos();
    fetchRoles();
  }, [fetchAdministrativos, fetchRoles]);

  return (
    <>
      <Breadcrumb pageName="Administrativos" lastPage="" />
      <div className="bg-white dark:bg-boxdark shadow-default px-5 sm:px-7.5 pt-6 pb-2.5 xl:pb-1 border border-stroke dark:border-strokedark rounded-sm">
        <div className="flex justify-between items-center px-6.5 py-4 border-stroke dark:border-strokedark border-b">
          <h3 className="font-medium text-black dark:text-white">
            Lista de administrativos
          </h3>
          <div className="ml-auto">
            <Link
              to="/admin/administrativos/registrar"
              title="Registrar Administrativo"
              className="flex justify-between items-center gap-2 bg-primary hover:bg-opacity-90 px-4 py-2 rounded-lg font-medium text-white transition"
            >
              <FaRegPlusSquare /> Administrativo
            </Link>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 dark:bg-meta-4 text-left">
                <th className="px-4 py-4 min-w-[20px] font-medium text-black dark:text-white">
                  ID
                </th>
                <th className="px-4 py-4 xl:pl-11 min-w-[220px] font-medium text-black dark:text-white">
                  Nombre
                </th>
                <th className="px-4 py-4 min-w-[150px] font-medium text-black dark:text-white">
                  Apellido
                </th>
                <th className="px-4 py-4 min-w-[150px] font-medium text-black dark:text-white">
                  Email
                </th>
                <th className="px-4 py-4 min-w-[120px] font-medium text-black dark:text-white">
                  Teléfono
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Rol
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Editar
                </th>
              </tr>
            </thead>
            <tbody>
              {administrativos?.map((admin) => (
                <tr
                  key={admin.id}
                  className="border-stroke dark:border-strokedark border-b"
                >
                  <td className="px-4 py-4 text-black dark:text-white">
                    {admin.id}
                  </td>
                  <td className="px-4 py-4 xl:pl-11 text-black dark:text-white">
                    {admin.nombre}
                  </td>
                  <td className="px-4 py-4 text-black dark:text-white">
                    {admin.apellido}
                  </td>
                  <td className="px-4 py-4 text-black dark:text-white">
                    {admin.email}
                  </td>
                  <td className="px-4 py-4 text-black dark:text-white">
                    {admin.telefono}
                  </td>
                  <td className="px-4 py-4 text-black dark:text-white">
                    {admin.rol?.nombre}
                  </td>
                  <td>
                    <Link to={`/admin/administrativos/${admin.id}/editar`}>
                      <FaEdit className="w-5 h-5 text-orange-500 hover:text-orange-700 cursor-pointer" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Administrativos;
