import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import { useUsuariosContext } from '../../../Context/UsuariosContext';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { useUserContext } from '../../../Context/UserContext';
import { Usuario } from '../../../types/Usuario';
import Loader from '../../../common/Loader';
import { Rol } from '../../../types/Rol';

const BASE_URL =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_URL_BACKEND_PROD
    : import.meta.env.VITE_URL_BACKEND_LOCAL;

type FormData = {
  id: number;
  nombre: string;
  email: string;
  cedula: string;
  celular: string;
  direccion: string;
  rol: Rol | null;
  activo: boolean;
};

const EditarVendedor: React.FC = () => {
  const token = localStorage.getItem('token');
  const { id } = useParams<{ id: string }>();
  const { modulo } = useUserContext();
  const { roles, usuarios, fetchUsuarios } = useUsuariosContext();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [usuarioLoaded, setUsuarioLoaded] = useState(false);
  const navigate = useNavigate();

  const usuario = useMemo(
    () =>
      usuarios?.find((item: Usuario) => item.id === parseInt(id ?? '0', 10)),
    [usuarios, id],
  );

  const [formData, setFormData] = useState<FormData>({
    id: usuario?.id || 0,
    nombre: usuario?.nombre || '',
    email: usuario?.email || '',
    cedula: usuario?.cedula || '',
    celular: usuario?.celular || '',
    direccion: usuario?.direccion || '',
    rol: usuario?.rol || null,
    activo: usuario?.activo || false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    if (name === 'rol') {
      const selectedRol = roles?.find((rol) => rol.id === parseInt(value));
      setFormData((prevData) => ({
        ...prevData,
        rol: selectedRol || null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    try {
      setLoading(true);
      const response = await axios.put(`${BASE_URL}usuario/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        console.log('Usuario actualizado:', response.data);
        fetchUsuarios();
        navigate(-1);
      } else {
        setErrorMsg(response.data.msg);
      }
    } catch (error) {
      setErrorMsg('Error al actualizar el usuario');
      console.error('Error al actualizar el usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If usuario is not found in context, fetch from backend
    if (!usuario && id && token) {
      setLoading(true);
      axios
        .get(`${BASE_URL}/api/administrativos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const u = response.data;
          setFormData({
            id: u.id,
            nombre: u.nombre,
            email: u.email,
            cedula: u.cedula,
            celular: u.telefono || u.celular || '',
            direccion: u.direccion || '',
            rol: u.rol || null,
            activo: u.activo ?? true,
          });
          setUsuarioLoaded(true);
        })
        .catch((err) => {
          setErrorMsg('No se pudo cargar el vendedor');
          console.error('Error fetching vendedor:', err);
        })
        .finally(() => setLoading(false));
    } else if (usuario) {
      setUsuarioLoaded(true);
    }
  }, [usuario, id, token]);

  if (!usuarioLoaded && loading) return <Loader />;
  if (!usuarioLoaded && errorMsg)
    return (
      <div className="bg-red-100 p-4 rounded text-red-700 text-center">
        {errorMsg}
      </div>
    );
  if (!usuarioLoaded) return null;

  return (
    <>
      <Breadcrumb pageName="Editar Vendedor" lastPage="vendedores" />
      {loading && <Loader />}
      <div className="bg-white shadow-md mx-auto mt-8 p-6 rounded-md w-full max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block mb-1 font-medium text-sm">Rol</label>
              <select
                name="rol"
                value={formData.rol?.id}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required={modulo !== 'admin'}
                disabled
              >
                <option value="">Seleccione un rol</option>
                {roles
                  ?.filter((rol) => rol.id !== 1)
                  .map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
              </select>
            </div>
            {[
              { label: 'Nombre', name: 'nombre', type: 'text' },
              { label: 'Email', name: 'email', type: 'text' },
              { label: 'Cédula', name: 'cedula', type: 'text' },
              { label: 'Celular', name: 'celular', type: 'text' },
              { label: 'Dirección', name: 'direccion', type: 'text' },
            ].map(({ label, name, type }) => (
              <div key={name} className="w-full">
                <label className="block mb-1 font-medium text-sm">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name as keyof FormData] as string}
                  onChange={handleChange}
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
            ))}
            <div className="flex items-center mb-4.5">
              <input
                name="activo"
                type="checkbox"
                checked={formData.activo}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-black dark:text-white">Activo</span>
            </div>
          </div>
          {errorMsg && (
            <div className="bg-red-100 mb-4 p-2 rounded-md text-red-700">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center gap-2 mt-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 mt-2 p-2.5 rounded-md w-full text-white"
            >
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditarVendedor;
