import React, { ReactNode,  } from 'react';

import { useClienteContext } from '../../Context/ClienteContext';
import { Carousel } from 'react-responsive-carousel';

const AuthLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { categorias } = useClienteContext();

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap items-center">
        <div className="hidden w-full xl:block xl:w-1/2">
          <div className="py-17.5 px-26 text-center">
            <Carousel autoPlay infiniteLoop className="rounded-lg">
              {categorias?.map((categoria: any, idx: number) => (
                <div key={idx}>
                  <h3 className="text-center text-xl font-bold dark:text-white underline">
                    {categoria.nombre}
                  </h3>
                  <img
                    src={categoria.imagen}
                    alt={`${categoria.nombre} - ${idx + 1}`}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
