import * as Dialog from '@radix-ui/react-dialog';
import { ProductoImagen } from '../../../types/productoImagen';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductoContext } from '../../../Context/ProductoContext';

const BASE_URL = import.meta.env.VITE_URL_BACKEND_LOCAL;


const EditarProductoImagen = ({
  modalOpen,
  setModalOpen,
  productoImagen,
}: {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  productoImagen: ProductoImagen;
}) => {
  const token = localStorage.getItem('token');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const navigate = useNavigate();
  const { fetchProductos } = useProductoContext();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      alert('Por favor seleccione una imagen para actualizar.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedImage);
    console.log(productoImagen);
    try {
      const response = await axios.put(
        `${BASE_URL}producto/imagen/${productoImagen.id}/update`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('Imagen actualizada:', response.data);
      if (response.data.success) {
        setModalOpen(false);
        navigate(-1);
        fetchProductos();
      } else {
        alert('Error al actualizar la imagen');
      }
    } catch (error) {
      console.error('Error al actualizar la imagen:', error);
    }
  };

  return (
    <>
      <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
          <form onSubmit={handleSubmit}>
            <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg mx-auto px-4">
              <div className="bg-white rounded-md shadow-lg px-4 py-6">
                <Dialog.Title className="text-lg font-medium text-gray-800 text-center mb-4 uppercase">
                  Editar Imagen
                </Dialog.Title>

                <img
                  src={productoImagen.imagen}
                  alt={`Imagen `}
                  className="w-20 h-20 object-cover rounded mb-4"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mb-4"
                />

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Actualizar Imagen
                </button>
              </div>
            </Dialog.Content>
          </form>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default EditarProductoImagen;
