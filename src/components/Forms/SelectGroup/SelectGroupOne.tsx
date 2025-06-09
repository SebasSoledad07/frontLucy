import React, { useState } from 'react';
import { MdCancel } from 'react-icons/md';

const SelectGroupOne: React.FC<{
  filteredProductos: any[];
  onSearch: (searchText: string) => void;
  onSort: (order: string) => void;
  onClearFilters: () => void;
}> = ({ onSearch, onSort, onClearFilters }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedOption, setSelectedOption] = useState<string>('');

  // Manejar cambio en el input de búsqueda
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchText(text);
    onSearch(text);
  };

  // Manejar cambio en el select
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value;
    setSelectedOption(option);
    onSort(option);
  };

  return (
    <div className="flex flex-wrap gap-4 items-center mb-3 mt-1 border-b border-gray-300 pb-2 ">
      {/* Input de búsqueda */}
      <input
        type="text"
        value={searchText}
        onChange={handleSearch}
        placeholder="Buscar por nombre"
        className="flex-grow rounded-lg border border-stroke bg-transparent py-2 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
      />

      {/* Select de ordenamiento */}
      <select
        value={selectedOption}
        onChange={handleSelect}
        className="rounded-lg border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
      >
        <option value="">Ordenar por precio</option>
        <option value="asc">Precio: menor a mayor</option>
        <option value="desc">Precio: mayor a menor</option>
      </select>

      {/* Botón para limpiar filtros */}
      <MdCancel  onClick={onClearFilters}  className=" text-xl text-red-600 hover:text-red-900 mr-3"/>
      
    </div>
  );
};

export default SelectGroupOne;
