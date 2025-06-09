import * as Dialog from '@radix-ui/react-dialog'; 
import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import clsx from 'clsx';

interface EstadoPedidoModalProps {
  estadosPosibles: string[];
  estadoActual: string;
  onActualizarEstado: (data: {
    estadoActual: string;
    estado: string;
    guia?: string;
    paginaSeguimiento?: string;
    descripcion: string;
  }) => void;
}

const EstadoPedidoModal: React.FC<EstadoPedidoModalProps> = ({
  estadosPosibles,
  estadoActual,
  onActualizarEstado,
}) => {
  const [guia, setGuia] = useState<string>('');
  const [paginaSeguimiento, setPaginaSeguimiento] = useState<string>('https://www.servientrega.com/wps/portal/rastreo-envio');
  const [descripcion, setDescripcion] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const estadoSiguiente = (() => {
    const estadosBase = ['RECIBIDO', 'PREPARACION', 'ENVIADO', 'ENTREGADO'];
    const indexActual = estadosBase.indexOf(estadoActual);
    return indexActual >= 0 && indexActual < estadosBase.length - 1
      ? estadosBase[indexActual + 1]
      : null;
  })();

  const handleActualizarEstado = () => {
    if (estadoSiguiente === 'ENVIADO' && (!guia || !paginaSeguimiento)) {
      setError(
        'Los campos "Guía" y "Página de seguimiento" son obligatorios para el estado "Enviado".',
      );
      return;
    }

    setError('');
    onActualizarEstado({
      estadoActual,
      estado: estadoSiguiente!,
      guia,
      paginaSeguimiento,
      descripcion,
    });
    setIsModalOpen(false);
  };

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Dialog.Trigger asChild>
        {estadoActual !=="ENTREGADO" &&(
        <button className="btn btn-primary underline font-bold">
          Actualizar Estado
        </button>
        )}
      </Dialog.Trigger>
      <Dialog.Overlay className="fixed inset-0 bg-black/30" />
      <Dialog.Content
        className={clsx(
          'fixed p-6 bg-white rounded-lg shadow-md',
          'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          'w-full max-w-md',
        )}
      >
        <div className="flex justify-between items-center mb-4">
          <Dialog.Title className="text-lg font-bold">
            Actualizar Estado del Pedido
          </Dialog.Title>
          <Dialog.Close className="text-gray-500 hover:text-gray-800">
            <AiOutlineClose className="w-5 h-5" />
          </Dialog.Close>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Próximo Estado</label>
          <select
            value={estadoSiguiente || ''}
            disabled
            className="w-full p-2 border rounded-md"
          >
            {estadoSiguiente && (
              <option value={estadoSiguiente}>{estadoSiguiente}</option>
            )}
          </select>
        </div>
        {estadoSiguiente === 'ENVIADO' && (
          <>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Guía</label>
              <input
                type="text"
                value={guia}
                onChange={(e) => setGuia(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">
                Página de Seguimiento
              </label>
              <input
                type="text"
                value={paginaSeguimiento}
                onChange={(e) => setPaginaSeguimiento(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </>
        )}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">
            Descripción (Opcional)
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={3}
          />
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="flex justify-end gap-2">
          <Dialog.Close asChild>
            <button className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md border outline-none ring-offset-2 ring-indigo-600 focus:ring-2">
              Cancelar
            </button>
          </Dialog.Close>
          <button
            onClick={handleActualizarEstado}
            className="w-full mt-2 p-2.5 flex-1 text-white bg-indigo-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2"
          >
            Actualizar
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default EstadoPedidoModal;
