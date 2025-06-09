import React, { useState,  useMemo } from 'react';
import axios from 'axios';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { useUsuariosContext } from '../../../Context/UsuariosContext';
import Loader from '../../../common/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import { Usuario } from '../../../types/Usuario';
import { Rol } from '../../../types/Rol';
import { useUserContext } from '../../../Context/UserContext';

const BASE_URL = import.meta.env.VITE_URL_BACKEND_LOCAL;


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
  const {modulo}=useUserContext();
  const { roles, usuarios, fetchUsuarios } = useUsuariosContext();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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

  return (
    <>
      <Breadcrumb pageName="Editar Vendedor" lastPage="vendedores" />
      {loading && <Loader />}
      <div className="w-full max-w-5xl mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Rol</label>
              <select
                name="rol"
                value={formData.rol?.id}
                onChange={handleChange}
                className="w-full rounded border p-2"
                required={modulo!=="admin"}
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
                <label className="block text-sm font-medium mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name as keyof FormData] as string}
                  onChange={handleChange}
                  className="w-full rounded border p-2"
                  required
                />
              </div>
            ))}
            <div className="mb-4.5 flex items-center">
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
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center gap-2 mt-4">
            <button
              type="submit"
              className="w-full mt-2 p-2.5 flex-1 text-white bg-indigo-600 rounded-md"
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
