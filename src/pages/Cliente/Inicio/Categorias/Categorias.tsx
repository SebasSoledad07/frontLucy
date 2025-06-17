import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import React from 'react';

import { useClienteContext } from '../../../../Context/ClienteContext';
import CardProducto from './CardProducto';

const Categorias: React.FC = () => {
  const { categorias } = useClienteContext();

  return (
    <div className="mx-auto px-4 py-12 container" id="categorias">
      <h2 className="mb-8 font-bold text-[#FF3C8E] dark:text-[#FF94C2] text-3xl text-center uppercase">
        Todos los productos
      </h2>
      <CardProducto />
    </div>
  );
};

export default Categorias;
