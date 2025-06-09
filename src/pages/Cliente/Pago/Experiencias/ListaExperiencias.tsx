import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface Experiencia {
  id: number;
  nombre:string;
  experiencia: number; // Calificación de experiencia (estrellas)
  recomendacion: number; // Nivel de recomendación (1-10)
  reseña: string; // Reseña del cliente
  fechaRegistro: string;
}

const ListaExperiencias: React.FC = () => {
  const BASE_URL = import.meta.env.VITE_URL_BACKEND_LOCAL;
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);

  useEffect(() => {
    // Fetch the list of experiences when the component loads
    const fetchExperiencias = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}factura/cliente/experiencias`,
        );
        console.log(response.data);
        setExperiencias(response.data.data);
      } catch (error) {
        console.error('Error fetching experiences:', error);
      }
    };

    fetchExperiencias();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 uppercase text-center">
        Experiencias de Clientes
      </h2>
      {experiencias?.length === 0 ? (
        <p className="text-center">No hay experiencias registradas aún.</p>
      ) : (
        <div
        style={{
          overflowY: 'auto',
          maxHeight: '350px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        className="max-h-[400px] overflow-y-scroll  rounded-md p-4 scrollbar-hide"
      >
        <ul className="space-y-4">
          {experiencias?.map((experiencia) => (
            <li
              key={experiencia.id}
              className="p-4 border-t shadow-md"
            >
                <div className="mb-2 flex justify-between">
                <strong>{experiencia?.nombre}</strong> 
                <strong>
                  {experiencia?.fechaRegistro.split('T')[0]}
                </strong>
              </div>
              <div className="mb-2">
                <strong>Calificación de la experiencia:</strong>
                <div className="flex gap-1 text-yellow-500 text-2xl mt-1">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={index < experiencia.experiencia ? 'text-yellow-500' : 'text-gray-300'}
                    />
                  ))}
                </div>
              </div>
              <div className="mb-2">
                <strong>Recomendación:</strong>
                <div className="flex gap-2 mt-1">
                  {[...Array(10)].map((_, index) => (
                    <span
                      key={index + 1}
                      className={`px-2 py-1 border rounded ${
                        experiencia.recomendacion === index + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-black'
                      }`}
                    >
                      {index + 1}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mb-2">
                <strong>Reseña:</strong> {experiencia.reseña}
              </div>
            </li>
          ))}
        </ul>
        </div>
      )}
    </div>
  );
};

export default ListaExperiencias;
