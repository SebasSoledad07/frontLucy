import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useUsuariosContext } from '../../../Context/UsuariosContext';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../../common/Loader';
import { Rol } from '../../../types/Rol';


const BASE_URL =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_URL_BACKEND_PROD
    : import.meta.env.VITE_URL_BACKEND_LOCAL;

const RegistrarVendedor: React.FC = () => {
  const token = localStorage.getItem('token');
  const { roles, fetchUsuarios } = useUsuariosContext();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    cedula: '',
    telefono: '',
    direccion: '',
    password: '',
    rol: '',
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      setLoading(true);
      const payload = {
        ...formData,
        rol: roles?.find((rol) => rol.id === parseInt(formData.rol)),
      };
      const response = await axios.post(
        `${BASE_URL}/api/administrativos`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 201 || response.data.success) {
        setFormData({
          nombre: '',
          apellido: '',
          email: '',
          cedula: '',
          telefono: '',
          direccion: '',
          password: '',
          rol: '',
        });
        fetchUsuarios();
        navigate(-1);
      } else {
        setErrorMsg(response.data?.msg || 'Error al registrar el vendedor');
      }
    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.msg ||
          'Error inesperado al registrar el vendedor',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Registrar Vendedor" lastPage="vendedores" />
      {loading && <Loader />}
      <div className="bg-white shadow-md mx-auto mt-8 p-6 rounded-md w-full max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2">
            <div className="w-full">
              <label className="block mb-1 font-medium text-sm">Rol</label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              >
                <option value="">Seleccione un rol</option>
                {roles
                  ?.filter((rol) => rol.nombre !== 'ADMINISTRADOR')
                  .map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
              </select>
            </div>
            <div className="w-full">
              <label className="block mb-1 font-medium text-sm">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </div>
            <div className="w-full">
              <label className="block mb-1 font-medium text-sm">Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </div>
            <div className="w-full">
              <label className="block mb-1 font-medium text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </div>
            <div className="w-full">
              <label className="block mb-1 font-medium text-sm">Cédula</label>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </div>
            <div className="w-full">
              <label className="block mb-1 font-medium text-sm">Celular</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </div>
            <div className="w-full">
              <label className="block mb-1 font-medium text-sm">
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </div>
            <div className="w-full">
              <label className="block mb-1 font-medium text-sm">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
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
              Registrar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegistrarVendedor;
