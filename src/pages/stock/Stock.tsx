import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { BsFillBagPlusFill } from 'react-icons/bs';
import { useUserContext } from '../../Context/UserContext';
import CardProducto from './producto/CardProducto';
import RegistrarProducto from './registrar/RegistrarProducto';
const Stock: React.FC = () => {
  useUserContext();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  return (
    <>
      <Breadcrumb pageName="Stock" lastPage="" />
      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          <div className="rounded-lg border border-[#F4B1C7] bg-[#FFFFFF] shadow-sm">
            <div className="border-b border-[#F4B1C7] py-4 px-6.5 flex items-center justify-between bg-[#F9C6C4]/40 rounded-t-lg">
              <h3 className="font-medium text-[#7A5B47] text-lg">
                Lista de productos
              </h3>
              <button
                onClick={() => setMostrarFormulario(!mostrarFormulario)}
                className="flex items-center justify-between gap-2 bg-[#B695E0] text-white rounded-lg px-4 py-2 font-medium transition hover:bg-[#A27FD6] hover:shadow-md"
              >
                <BsFillBagPlusFill className="text-[#FFE482]" />
                <span>Nuevo Producto</span>
              </button>
            </div>

            <div className="p-6">
              <CardProducto />
              {mostrarFormulario && <RegistrarProducto />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Stock;
