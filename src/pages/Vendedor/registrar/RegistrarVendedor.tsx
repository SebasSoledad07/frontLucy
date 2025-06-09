import React, { useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { useUsuariosContext } from '../../../Context/UsuariosContext';
import Loader from '../../../common/Loader';
import { useNavigate } from 'react-router-dom';
import { Rol } from '../../../types/Rol';

const BASE_URL = import.meta.env.VITE_URL_BACKEND_LOCAL;


type FormData = {
  nombre: string;
  email: string;
  cedula: string;
  celular: string;
  direccion: string;
  password: string;
  rol: Rol | null;
};

const RegistrarVendedor: React.FC = () => {
  const token = localStorage.getItem('token');
  const { roles, fetchUsuarios } = useUsuariosContext();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate=useNavigate()
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    cedula: '',
    celular: '',
    direccion: '',
    password: '',
    rol: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'rol') {
      const selectedRol = roles?.find((rol) => rol.id === parseInt(value));
      setFormData((prevData) => ({
        ...prevData,
        rol: selectedRol || null,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}usuario/save`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setFormData({
          nombre: '',
          email: '',
          cedula: '',
          celular: '',
          direccion: '',
          password: '',
          rol: null,
        });
        console.log('Usuario registrado:', response.data);
        fetchUsuarios();
        navigate(-1)
      } else {
        setErrorMsg(response.data.msg);
      }
    } catch (error) {
      setErrorMsg('Error al registrar el usuario');
      console.error('Error al registrar el usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Registrar Vendedor" lastPage="vendedores" />
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
                required
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
              { label: 'Email', name: 'email', type: 'email' },
              { label: 'Cédula', name: 'cedula', type: 'text' },
              { label: 'Celular', name: 'celular', type: 'text' },
              { label: 'Dirección', name: 'direccion', type: 'text' },
              { label: 'Password', name: 'password', type: 'password' },
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
              Registrar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegistrarVendedor;
