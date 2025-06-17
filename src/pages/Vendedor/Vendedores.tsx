import { FaEdit, FaRegPlusSquare } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import RegistrarVendedor from './registrar/RegistrarVendedor';
import { useUserContext } from '../../Context/UserContext';
import Loader from '../../common/Loader';

const BASE_URL =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_URL_BACKEND_PROD
    : import.meta.env.VITE_URL_BACKEND_LOCAL;

interface Rol {
  id: number;
  nombre: string;
}

interface Vendedor {
  id: number;
  nombre: string;
  apellido?: string;
  email: string;
  telefono: string; // Celular
  cedula: string;
  rol: Rol;
}

const Vendedores = () => {
  const { modulo } = useUserContext();
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchVendedores = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const response = await axios.get(`${BASE_URL}/api/administrativos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Only keep those whose rol.nombre !== 'ADMINISTRADOR'
        const vendedoresFiltrados = response.data.filter(
          (adm: Vendedor) => adm.rol && adm.rol.nombre !== 'ADMINISTRADOR',
        );
        setVendedores(vendedoresFiltrados);
      } catch (error: any) {
        setErrorMsg('Error al obtener vendedores');
        setVendedores([]);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchVendedores();
  }, [token]);

  return (
    <>
      <Breadcrumb pageName="Vendedores" lastPage="usuarios" />
      {loading && <Loader />}
      {errorMsg && (
        <div className="bg-red-100 mb-4 p-2 rounded-md text-red-700">
          {errorMsg}
        </div>
      )}
      <div className="bg-white dark:bg-boxdark shadow-default p-6.5 border border-stroke dark:border-strokedark rounded-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-black dark:text-white">
            Lista de Vendedores
          </h3>
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="flex justify-between items-center gap-2 bg-primary hover:bg-opacity-90 px-4 py-2 rounded-lg font-medium text-white transition"
          >
            <FaRegPlusSquare /> Nuevo Vendedor
          </button>
        </div>
        {mostrarFormulario && <RegistrarVendedor />}
        <div className="overflow-x-auto">
          <table className="divide-y divide-gray-200 min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Celular</th>
                <th className="px-4 py-2">Cédula</th>
                <th className="px-4 py-2">Rol</th>
                <th className="px-4 py-2">Editar</th>
              </tr>
            </thead>
            <tbody>
              {vendedores.map((v) => (
                <tr key={v.id}>
                  <td className="px-4 py-2">
                    {v.nombre} {v.apellido || ''}
                  </td>
                  <td className="px-4 py-2">{v.email}</td>
                  <td className="px-4 py-2">{v.telefono}</td>
                  <td className="px-4 py-2">{v.cedula}</td>
                  <td className="px-4 py-2">{v.rol?.nombre}</td>
                  <td className="px-4 py-2">
                    <Link to={'/admin/vendedores/' + v.id + '/editar'}>
                      <FaEdit className="w-5 h-5 text-orange-500 hover:text-orange-700 cursor-pointer" />
                    </Link>
                  </td>
                </tr>
              ))}
              {vendedores.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="py-4 text-center">
                    No hay vendedores registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Vendedores;
