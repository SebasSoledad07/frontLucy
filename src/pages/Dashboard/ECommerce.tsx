import * as Dialog from '@radix-ui/react-dialog';
import React, { useState } from 'react';
import axios from 'axios';

import { useProductoContext } from '../../Context/ProductoContext';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useUserContext } from '../../Context/UserContext';
import CategoriasList from './CategoriasList';
import Loader from '../../common/Loader';

const ECommerce = () => {
  const { categorias } = useProductoContext();
  const { modulo } = useUserContext();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [entityType, setEntityType] = useState<string>('');
  const [nombre, setNombre] = useState<string>('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [categoriaId, setCategoriaId] = useState<number | undefined>();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  // URL base del backend desde el archivo .env
  const BASE_URL = import.meta.env.VITE_URL_BACKEND_LOCAL;

  const handleOpenModal = (type: string) => {
    setEntityType(type);
    setModalOpen(true);
    setNombre('');
    setImagen(null);
    setCategoriaId(undefined);
    setErrorMsg('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImagen(e.target.files[0]);
    }
  };

  const handleGuardarEntidad = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (entityType === 'categoria') {
        await saveCategoria();
      } else if (entityType === 'subCategoria') {
        if (!categoriaId) return;
        await saveSubCategoria();
      }
    } catch (error) {
      console.error('Error al guardar la entidad:', error);
    }
  };

  const saveCategoria = async () => {
    const formData = new FormData();
    formData.append(
      'categoria',
      new Blob([JSON.stringify({ nombre })], { type: 'application/json' }),
    );
    if (imagen) formData.append('file', imagen);

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}detalles/categoria/save`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        setModalOpen(false);
      } else {
        setErrorMsg(response.data.msg);
      }
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSubCategoria = async () => {
    const subCategoria = {
      nombre,
      categoria: categorias
        ? categorias.find((cat) => cat.id === categoriaId)
        : undefined,
    };

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}detalles/sub/categoria/save`,
        subCategoria,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setModalOpen(false);
      } else {
        setErrorMsg(response.data.msg);
      }
    } catch (error) {
      console.error('Error al guardar la subcategoría:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Inicio" lastPage="" />
      {loading && <Loader />}
      <div className="bg-white dark:bg-boxdark shadow-default border border-stroke dark:border-strokedark rounded-sm">
        {modulo === 'admin' && (
          <div className="mb-2">
            <div className="flex gap-4 p-4">
              <button
                onClick={() => handleOpenModal('categoria')}
                className="bg-primary p-3 rounded text-white"
              >
                Registrar Categoría
              </button>
              <button
                onClick={() => handleOpenModal('subCategoria')}
                className="bg-primary p-3 rounded text-white"
              >
                Registrar SubCategoría
              </button>
            </div>
          </div>
        )}

        <div className="flex space-x-4 p-4 overflow-x-auto">
          <CategoriasList />
        </div>

        <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-40 w-full h-full" />
            <form onSubmit={handleGuardarEntidad}>
              <Dialog.Content className="top-[50%] left-[50%] fixed mx-auto px-4 w-full max-w-lg translate-x-[-50%] translate-y-[-50%]">
                <div className="bg-white shadow-lg px-4 py-6 rounded-md">
                  <Dialog.Title className="mb-4 font-medium text-gray-800 text-lg text-center uppercase">
                    {entityType === 'categoria' && 'Registrar Categoría'}
                    {entityType === 'subCategoria' && 'Registrar SubCategoría'}
                  </Dialog.Title>
                  {errorMsg && (
                    <div className="bg-red-100 mb-4 p-2 rounded-md text-red-700">
                      {errorMsg}
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="mb-4">
                      <label className="block mb-2 font-medium text-sm">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="p-2 border rounded w-full"
                        required
                      />
                    </div>

                    {entityType === 'categoria' && (
                      <div className="mb-4">
                        <label className="block mb-3 text-black dark:text-white">
                          Agregar Imagen
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="disabled:bg-whiter dark:bg-form-input dark:file:bg-white/30 file:bg-[#EEEEEE] file:mr-4 p-3 file:px-2.5 file:py-1 border border-stroke focus:border-primary active:border-primary dark:border-form-strokedark dark:file:border-strokedark file:border-[0.5px] file:border-stroke file:focus:border-primary file:rounded rounded-md outline-none w-full dark:file:text-white file:text-sm transition disabled:cursor-default"
                          required
                        />
                      </div>
                    )}

                    {entityType === 'subCategoria' && (
                      <div className="mb-4">
                        <label className="block mb-2 font-medium text-sm">
                          Categoría
                        </label>
                        <select
                          value={categoriaId}
                          onChange={(e) =>
                            setCategoriaId(parseInt(e.target.value))
                          }
                          className="p-2 border rounded w-full"
                          required
                        >
                          <option value="">Seleccione una categoría</option>
                          {categorias?.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Dialog.Close asChild>
                      <button className="flex-1 mt-2 p-2.5 border rounded-md outline-none ring-indigo-600 focus:ring-2 ring-offset-2 w-full text-gray-800">
                        Cancelar
                      </button>
                    </Dialog.Close>
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 mt-2 p-2.5 rounded-md outline-none ring-indigo-600 focus:ring-2 ring-offset-2 w-full text-white"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </Dialog.Content>
            </form>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </>
  );
};

export default ECommerce;
