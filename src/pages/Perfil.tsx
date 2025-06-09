import { FaLocationArrow, FaPhoneAlt, FaUser } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useUserContext } from '../Context/UserContext';
import { Rol } from '../types/Rol';
import { useState } from 'react';
import axios from 'axios';
import Loader from '../common/Loader';

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
const Perfil = () => {
  const token = localStorage.getItem('token');
  const { usuario, fetchInformacionUsuario } = useUserContext();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
        fetchInformacionUsuario(formData?.id);
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
       {loading && <Loader />}
      <div className="mx-auto max-w-270">
        <div className="grid grid-cols-1 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Información Personal
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Nombre's
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <FaUser className="fill-current" />
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="nombre"
                          placeholder="Devid Jhon"
                          value={formData.nombre}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="phoneNumber"
                      >
                        Celular
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <FaPhoneAlt className="fill-current" />
                        </span>
                      </div>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3  pl-11.5 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="celular"
                        
                        placeholder="+990 3343 7865"
                        value={formData.celular}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <MdEmail className="fill-current" />
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="devidjond45@gmail.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="Username"
                    >
                      Dirreción
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <FaLocationArrow className="fill-current" />
                      </span>

                      <textarea
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        name='direccion'
                        value={formData.direccion}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Write your bio here"
                        required
                       
                      ></textarea>
                    </div>
                  </div>
                  {errorMsg && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
                      {errorMsg}
                    </div>
                  )}
                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      Actualizar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Perfil;
