import * as Dialog from '@radix-ui/react-dialog';
import axios from 'axios';
import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

interface ExperienciaCompraProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExperienciaCompra: React.FC<ExperienciaCompraProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const BASE_URL = import.meta.env.VITE_URL_BACKEND_LOCAL;
  const { ref } = useParams();
  const [estrellas, setEstrellas] = useState<number>(0);
  const [recomendacion, setRecomendacion] = useState<number>(0);
  const [resena, setResena] = useState<string>('');

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    // Validación de que el usuario ha respondido todas las preguntas
    if (estrellas === 0) {
      alert('Por favor, califique su experiencia de compra.');
      return;
    }

    if (recomendacion === 0) {
      alert('Por favor, indique su nivel de recomendación.');
      return;
    }

    if (resena.trim() === '') {
      alert('Por favor, deje su reseña.');
      return;
    }
    const experienciaCompra = {
      experiencia: estrellas,
      recomendacion,
      reseña: resena,
    };
    console.log(experienciaCompra);
    const headers = {
      'Content-Type': 'application/json',
    };
    setIsOpen(false);
    axios
      .post(
        BASE_URL + 'factura/cliente/ref/experiencia/save' + ref ,
        experienciaCompra,
        {
          headers,
        },
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching order details:', error);
      });
  };


  return !isOpen ? null: (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger />
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
      <Dialog.Content className="fixed text-black top-1/2 left-1/2 w-11/12 max-w-md transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleGuardar}>
          <h2 className="text-2xl font-bold mb-4 uppercase text-center">
            Califique su experiencia{' '}
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              1. ¿Cómo califica su experiencia de compra? (5 estrellas)
            </label>
            <div className="flex gap-2 justify-center text-3xl">
              {[1, 2, 3, 4, 5].map((value) => (
                <FaStar
                  key={value}
                  className={`cursor-pointer ${
                    value <= estrellas ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                  onClick={() => setEstrellas(value)}
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              2. ¿Del 1 al 10, recomendaría nuestra página a un amigo o
              familiar?
            </label>
            <div className="flex gap-2 justify-center">
              {[...Array(10)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`px-2 py-1 border rounded ${
                    recomendacion === index + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-black'
                  }`}
                  onClick={() => setRecomendacion(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              3. Deje su reseña
            </label>
            <input
              type="textarea"
              value={resena}
              required
              onChange={(e) => setResena(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Guardar
          </button>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ExperienciaCompra;
