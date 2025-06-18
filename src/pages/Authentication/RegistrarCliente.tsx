import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

import AuthLayout from './AuthLayout';

const BASE_URL =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_URL_BACKEND_PROD
    : import.meta.env.VITE_URL_BACKEND_LOCAL;

function RegistrarCliente() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    hashedPassword: '',
    telefono: '',
    tipoDocumento: '',
    numeroDocumento: '',
    fechaNacimiento: '',
    direccion: '',
    departamento: '',
    ciudad: '',
    barrio: '',
    codigoPostal: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post(`${BASE_URL}/api/clientes/register`, {
        ...form,
      });
      if (response.status === 201) {
        setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
        setTimeout(() => navigate('/cliente/login'), 1500);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Error al registrar. Intenta nuevamente.',
      );
    }
  };

  return (
    <AuthLayout>
      <div className="flex justify-center items-center bg-white dark:bg-boxdark border-stroke dark:border-strokedark xl:border-l-2 w-full xl:w-1/2 min-h-screen">
        <div className="bg-white dark:bg-boxdark shadow-lg p-8 sm:p-12 xl:p-16 rounded-lg w-full max-w-2xl">
          <span className="block mb-2 font-semibold text-primary text-lg tracking-wide">
            Lucy Mundo de Pijamas
          </span>
          <h2 className="mb-8 font-bold text-black sm:text-title-xl2 dark:text-white text-3xl text-center">
            Registrar Cliente
          </h2>
          {success && (
            <div className="mb-4 font-medium text-green-600 text-center">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 font-medium text-red-500 text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-white">
                  Nombre
                </label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  className="bg-transparent dark:bg-form-input px-4 py-2 border border-gray-300 dark:border-form-strokedark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-white">
                  Apellido
                </label>
                <input
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  required
                  className="bg-transparent dark:bg-form-input px-4 py-2 border border-gray-300 dark:border-form-strokedark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="bg-transparent dark:bg-form-input px-4 py-2 border border-gray-300 dark:border-form-strokedark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-white">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="hashedPassword"
                  value={form.hashedPassword}
                  onChange={handleChange}
                  required
                  className="bg-transparent dark:bg-form-input px-4 py-2 border border-gray-300 dark:border-form-strokedark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-white">
                  Teléfono
                </label>
                <input
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  required
                  className="bg-transparent dark:bg-form-input px-4 py-2 border border-gray-300 dark:border-form-strokedark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-white">
                  Tipo Documento
                </label>
                <select
                  name="tipoDocumento"
                  value={form.tipoDocumento}
                  onChange={handleChange}
                  required
                  className="bg-transparent dark:bg-form-input px-4 py-2 border border-gray-300 dark:border-form-strokedark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full text-black dark:text-white"
                >
                  <option value="">Selecciona</option>
                  <option value="CC">CC</option>
                  <option value="CE">CE</option>
                  <option value="TI">TI</option>
                  <option value="NIT">NIT</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-white">
                  Número Documento
                </label>
                <input
                  name="numeroDocumento"
                  value={form.numeroDocumento}
                  onChange={handleChange}
                  required
                  className="bg-transparent dark:bg-form-input px-4 py-2 border border-gray-300 dark:border-form-strokedark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-white">
                  Fecha Nacimiento
                </label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={form.fechaNacimiento}
                  onChange={handleChange}
                  required
                  className="bg-transparent dark:bg-form-input px-4 py-2 border border-gray-300 dark:border-form-strokedark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-white">
                  Dirección
                </label>
                <input
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  required
                  className="bg-transparent dark:bg-form-input px-4 py-2 border border-gray-300 dark:border-form-strokedark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-white">
                  Departamento
                </label>
                <input
                  name="departamento"
                  value={form.departamento}
                  onChange={handleChange}
                  required
                  className="bg-transparent dark:bg-form-input px-4 py-2 border border-gray-300 dark:border-form-strokedark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-white">
                  Ciudad
                </label>
                <input
                  name="ciudad"
                  value={form.ciudad}
                  onChange={handleChange}
                  required
                  className="bg-transparent dark:bg-form-input px-4 py-2 border border-gray-300 dark:border-form-strokedark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-white">
                  Barrio
                </label>
                <input
                  name="barrio"
                  value={form.barrio}
                  onChange={handleChange}
                  required
                  className="bg-transparent dark:bg-form-input px-4 py-2 border border-gray-300 dark:border-form-strokedark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-white">
                  Código Postal
                </label>
                <input
                  name="codigoPostal"
                  value={form.codigoPostal}
                  onChange={handleChange}
                  required
                  className="bg-transparent dark:bg-form-input px-4 py-2 border border-gray-300 dark:border-form-strokedark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full text-black dark:text-white"
                />
              </div>
            </div>
            <div className="mt-8">
              <button
                type="submit"
                className="bg-primary hover:bg-opacity-90 shadow-md p-4 border border-primary rounded-lg w-full font-semibold text-white text-lg transition cursor-pointer"
              >
                Registrarse
              </button>
            </div>
            <div className="mt-6 text-center">
              <Link
                to="/cliente/login"
                className="font-medium text-blue-600 hover:text-blue-900"
              >
                ¿Ya tienes cuenta? Inicia sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}

export default RegistrarCliente;
