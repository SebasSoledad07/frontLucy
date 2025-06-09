import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import axios from 'axios';
import { useProductoContext } from '../../Context/ProductoContext';
import CategoriasList from './CategoriasList';
import Loader from '../../common/Loader';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useUserContext } from '../../Context/UserContext';
const ECommerce = () => {
  const { categorias } = useProductoContext();
  const {modulo}=useUserContext();
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
        if(!categoriaId) return
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
      if(response.data.success){
        setModalOpen(false);
      }else{
        setErrorMsg(response.data.msg);
      }
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
    }
    finally {
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
  
      if(response.data.success){
        setModalOpen(false);
      }else{
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
   <Breadcrumb pageName="Catalogo" lastPage="" />
   {loading && 
        <Loader />
        }
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {modulo==="admin" && (
      <div className="mb-2">
        <div className="flex gap-4 p-4">
       
          <button
            onClick={() => handleOpenModal('categoria')}
            className="rounded bg-primary p-3 text-white"
          >
            Registrar Categoría
          </button>
          <button
            onClick={() => handleOpenModal('subCategoria')}
            className="rounded bg-primary p-3 text-white"
          >
            Registrar SubCategoría
          </button>
        </div>
      </div>
      )}
      
      <div className="flex space-x-4 overflow-x-auto p-4">
        <CategoriasList />
      </div>

      <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
         <form onSubmit={handleGuardarEntidad}>
         <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg mx-auto px-4">
            <div className="bg-white rounded-md shadow-lg px-4 py-6">
              <Dialog.Title className="text-lg font-medium text-gray-800 text-center mb-4 uppercase">
                {entityType === 'categoria' && 'Registrar Categoría'}
                {entityType === 'subCategoria' && 'Registrar SubCategoría'}

              </Dialog.Title>
              {errorMsg && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full rounded border p-2"
                    required
                  />
                </div>

                {entityType === 'categoria' && (
                  <div className="mb-4">
                    <label className="mb-3 block text-black dark:text-white">
                      Agregar Imagen
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                      required
                   />
                  </div>
                )}

                {entityType === 'subCategoria' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Categoría
                    </label>
                    <select
                      value={categoriaId}
                      onChange={(e) => setCategoriaId(parseInt(e.target.value))}
                      className="w-full rounded border p-2"
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
                  <button className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md border outline-none ring-offset-2 ring-indigo-600 focus:ring-2">
                    Cancelar
                  </button>
                </Dialog.Close>
                <button
                type='submit'
                  className="w-full mt-2 p-2.5 flex-1 text-white bg-indigo-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2"
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
