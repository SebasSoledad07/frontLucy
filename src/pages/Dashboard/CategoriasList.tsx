import React from 'react';

const CategoriasList = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh]">
      <h1 className="drop-shadow-lg mb-4 font-bold text-indigo-700 text-3xl md:text-5xl text-center">
        Bienvenido al dashboard
      </h1>
      <p className="max-w-xl text-gray-600 text-lg text-center">
        Gestiona tus categorías, subcategorías y catálogos de manera sencilla y
        eficiente.
      </p>
    </div>
  );
};

export default CategoriasList;
