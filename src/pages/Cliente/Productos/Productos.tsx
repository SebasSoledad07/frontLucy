import 'react-responsive-carousel/lib/styles/carousel.min.css';

import React, { useState, useMemo, useCallback, useEffect } from 'react';

import SelectGroupOne from '../../../components/Forms/SelectGroup/SelectGroupOne';
import SidebarLinkGroup from '../../../components/Sidebar/SidebarLinkGroup';
import ProductList from './CardProductos/CardProductos';
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
  // Estados para los datos
  const [productos, setProductos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para los filtros
  const [selectedCategoria, setSelectedCategoria] = useState<number | null>(
    null,
  );
  const [selectedSubCategoria, setSelectedSubCategoria] = useState<
    number | null
  >(null);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState<string>('');

  // Fetch productos, categorias y subcategorias
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get the current user JWT token from localStorage (or your auth context if needed)
        const token = localStorage.getItem('token');
        const headers: HeadersInit | undefined = token
          ? { Authorization: `Bearer ${token}` }
          : undefined;
        const [productosRes, categoriasRes, subcategoriasRes] =
          await Promise.all([
            fetch('/api/productos/todos', headers ? { headers } : undefined),
            fetch('/api/categorias', headers ? { headers } : undefined),
            fetch('/api/subcategorias', headers ? { headers } : undefined),
          ]);
        if (!productosRes.ok || !categoriasRes.ok || !subcategoriasRes.ok) {
          throw new Error('Error al obtener los datos');
        }
        const productosData = await productosRes.json();
        const categoriasData = await categoriasRes.json();
        const subcategoriasData = await subcategoriasRes.json();
        // Merge subcategorias into categorias
        const categoriasWithSubs = categoriasData.map((cat: any) => ({
          ...cat,
          subCategorias: subcategoriasData.filter(
            (sub: any) =>
              sub.categoria &&
              (sub.categoria.id === cat.id || sub.categoria === cat.id),
          ),
        }));
        setProductos(productosData);
        setCategorias(categoriasWithSubs);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Productos filtrados
  const filteredProductos = useMemo(() => {
    let filtered = productos?.filter((producto: any) => {
      const matchCategoria = selectedCategoria
        ? categorias?.some(
            (cat: any) =>
              cat.id === selectedCategoria &&
              cat.subCategorias?.some(
                (subCat: any) => subCat.id === producto.subcategoriaId,
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
    // Ordenar si es necesario
    if (sortOrder === 'asc') {
      filtered = filtered.sort((a: any, b: any) => a.precio - b.precio);
    } else if (sortOrder === 'desc') {
      filtered = filtered.sort((a: any, b: any) => b.precio - a.precio);
    }
    return filtered;
  }, [
    productos,
    categorias,
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

  if (loading) {
    return <div className="py-10 text-center">Cargando productos...</div>;
  }
  if (error) {
    return <div className="py-10 text-red-600 text-center">{error}</div>;
  }

  return (
    <>
      <PageTitle title="Lucy Mundo de Pijamas | Productos" />
      <div className="mx-auto container">
        <div className="flex md:flex-row flex-col">
          {/* Filtros (25% del ancho) */}
          <div className="mr-3 w-full md:w-1/4">
            <div className="space-y-6 bg-white dark:bg-slate-900 shadow-md p-4 dark:border dark:border-t rounded-lg">
              {/* Filtro de Categoría */}
              <SidebarLinkGroup activeCondition={false}>
                {(handleClick, open) => (
                  <>
                    <div
                      onClick={handleClick}
                      className="flex justify-between items-center py-2 border-gray-200 border-b cursor-pointer"
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
                          className="text-gray-700 hover:text-blue-600 cursor-pointer"
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
                        className="flex justify-between items-center py-2 border-gray-200 border-b cursor-pointer"
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
                            className="text-gray-700 hover:text-blue-600 cursor-pointer"
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
                                // Show tooltip with subcategory description if available
                                title={subCat.descripcion || ''}
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
                className="bg-red-600 hover:bg-red-900 mt-4 px-4 py-2 rounded w-full font-medium text-white"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
          {/* Productos (75% del ancho) */}
          <div className="bg-white dark:bg-slate-900 shadow-md dark:border dark:border-t rounded-lg w-full md:w-3/4">
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
