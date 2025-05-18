import React, { useState, useMemo, useCallback } from 'react';
import { useClienteContext } from '../../../Context/ClienteContext';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import SidebarLinkGroup from '../../../components/Sidebar/SidebarLinkGroup';
import ProductList from './CardProductos/CardProductos';
import SelectGroupOne from '../../../components/Forms/SelectGroup/SelectGroupOne';
import PageTitle from '../../../components/PageTitle';

function formatCurrency(value: number | 0) {
  if (typeof value !== 'number') {
    return '';
  }

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

const Productos: React.FC = () => {
  const { productos, categorias } = useClienteContext();

  // Estados para los filtros
  const [selectedCategoria, setSelectedCategoria] = useState<number | null>(
    null,
  );
  const [selectedSubCategoria, setSelectedSubCategoria] = useState<
    number | null
  >(null);

  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState<string>('');

  // Productos filtrados
  const filteredProductos = useMemo(() => {
    let filtered = productos?.filter((producto) => {
      const matchCategoria = selectedCategoria
        ? categorias?.some(
            (cat) =>
              cat.id === selectedCategoria &&
              cat.subCategorias?.some(
                (subCat) => subCat.id === producto.subcategoriaId,
              ),
          )
        : true;
      const matchSubCategoria = selectedSubCategoria
        ? producto.subcategoriaId === selectedSubCategoria
        : true;
      const matchSearch = searchText
        ? producto.nombre.toLowerCase().includes(searchText.toLowerCase())
        : true;
      return matchCategoria && matchSubCategoria && matchSearch;
    });

    return filtered;
  }, [
    productos,
    selectedCategoria,
    selectedSubCategoria,
    searchText,
    sortOrder,
  ]);

  // Funciones para actualizar los filtros
  const handleCategoriaChange = useCallback((categoriaId: number | null) => {
    setSelectedCategoria(categoriaId);
    setSelectedSubCategoria(null); // Reiniciar subcategoría al cambiar categoría
  }, []);

  const handleSubCategoriaChange = useCallback(
    (subCategoriaId: number | null) => {
      setSelectedSubCategoria(subCategoriaId);
    },
    [],
  );

  // Actualización de filtros
  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const handleSort = useCallback((order: string) => {
    setSortOrder(order);
  }, []);

  const handleLimpiarFiltros = useCallback(() => {
    setSelectedCategoria(null);
    setSelectedSubCategoria(null);
    setSearchText('');
    setSortOrder('');
  }, []);

  return (
    <>
      <PageTitle title="Lucy Mundo de Pijamas | Productos" />
      <div className="container mx-auto ">
        <div className="flex flex-col md:flex-row">
          {/* Filtros (25% del ancho) */}
          <div className="w-full md:w-1/4 mr-3 ">
            <div className="space-y-6 bg-white p-4 rounded-lg shadow-md  dark:bg-slate-900 dark:border-t dark:border">
              {/* Filtro de Categoría */}
              <SidebarLinkGroup activeCondition={false}>
                {(handleClick, open) => (
                  <>
                    <div
                      onClick={handleClick}
                      className="flex items-center justify-between cursor-pointer py-2 border-b border-gray-200"
                    >
                      <span className="font-semibold text-gray-800">
                        Categoría
                      </span>
                      <svg
                        className={`transform transition-transform duration-200 ${
                          open ? 'rotate-180' : ''
                        }`}
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <div className={`${!open && 'hidden'} mt-2`}>
                      <ul className="space-y-2 pl-0 list-none">
                        <li
                          className="cursor-pointer text-gray-700 hover:text-blue-600"
                          onClick={() => handleCategoriaChange(null)}
                        >
                          Todas las categorías
                        </li>
                        {categorias?.map((categoria) => (
                          <li
                            key={categoria.id}
                            className={`cursor-pointer text-gray-700 hover:text-blue-600 ${
                              selectedCategoria === categoria.id
                                ? 'text-blue-600 font-semibold'
                                : ''
                            }`}
                            onClick={() =>
                              handleCategoriaChange(categoria.id ?? null)
                            }
                          >
                            {categoria.nombre}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </SidebarLinkGroup>

              {/* Filtro de Subcategoría */}
              {selectedCategoria && (
                <SidebarLinkGroup activeCondition={false}>
                  {(handleClick, open) => (
                    <>
                      <div
                        onClick={handleClick}
                        className="flex items-center justify-between cursor-pointer py-2 border-b border-gray-200"
                      >
                        <span className="font-semibold text-gray-800">
                          Subcategoría
                        </span>
                        <svg
                          className={`transform transition-transform duration-200 ${
                            open ? 'rotate-180' : ''
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                      <div className={`${!open && 'hidden'} mt-2`}>
                        <ul className="space-y-2 pl-0 list-none">
                          <li
                            className="cursor-pointer text-gray-700 hover:text-blue-600"
                            onClick={() => handleSubCategoriaChange(null)}
                          >
                            Todas las subcategorías
                          </li>
                          {categorias
                            ?.find((cat) => cat.id === selectedCategoria)
                            ?.subCategorias?.map((subCat) => (
                              <li
                                key={subCat.id}
                                className={`cursor-pointer text-gray-700 hover:text-blue-600 ${
                                  selectedSubCategoria === subCat.id
                                    ? 'text-blue-600 font-semibold'
                                    : ''
                                }`}
                                onClick={() =>
                                  handleSubCategoriaChange(subCat.id ?? null)
                                }
                              >
                                {subCat.nombre}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </>
                  )}
                </SidebarLinkGroup>
              )}

              {/* Botón para limpiar filtros */}
              <button
                onClick={handleLimpiarFiltros}
                className="mt-4 w-full rounded bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-900"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
          {/* Productos (75% del ancho) */}
          <div className="w-full md:w-3/4 bg-white rounded-lg shadow-md dark:bg-slate-900 dark:border-t dark:border">
            <SelectGroupOne
              filteredProductos={filteredProductos || []}
              onSearch={handleSearch}
              onSort={handleSort}
              onClearFilters={handleLimpiarFiltros}
            />
            <ProductList
              filteredProductos={filteredProductos || []}
              formatCurrency={formatCurrency}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Productos;
