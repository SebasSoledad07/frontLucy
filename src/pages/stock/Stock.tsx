import React from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { BsFillBagPlusFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../Context/UserContext';
import CardProducto from './producto/CardProducto';
const Stock: React.FC = () => {
  const { modulo } = useUserContext();
  return (
    <>
      <Breadcrumb pageName="Stock" lastPage="" />
      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          {/* Contenedor principal */}
          <div className="rounded-lg border border-[#F4B1C7] bg-[#FFFFFF] shadow-sm">
            {/* Header */}
            <div className="border-b border-[#F4B1C7] py-4 px-6.5 flex items-center justify-between bg-[#F9C6C4]/40 rounded-t-lg">
              <h3 className="font-medium text-[#7A5B47] text-lg">
                Lista de productos
              </h3>
              {modulo === 'admin' && (
                <div className="ml-auto">
                  <Link
                    title="Registrar Producto"
                    to={`/${modulo}/stock/registrar`}
                    className="flex items-center justify-between gap-2 bg-[#B695E0] text-white rounded-lg px-4 py-2 font-medium transition hover:bg-[#A27FD6] hover:shadow-md"
                  >
                    <BsFillBagPlusFill className="text-[#FFE482]" />
                    <span>Nuevo Producto</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Contenido */}
            <div className="p-6">
              <CardProducto />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Stock;
