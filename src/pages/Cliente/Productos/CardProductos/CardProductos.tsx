import { useState, useEffect, useMemo, useCallback } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from 'react-router-dom';
import { BiSolidLike } from 'react-icons/bi';
import { motion } from 'framer-motion';

import { useCart } from '../../../../Context/CartContext';

const ProductList: React.FC<{
  filteredProductos: any[];
  formatCurrency: (value: number) => string;
}> = ({ filteredProductos, formatCurrency }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // New: State for categorias, subcategorias, filters
  const [categorias, setCategorias] = useState<any[]>([]);
  const [subcategorias, setSubcategorias] = useState<any[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string>('');
  const [selectedSubCategoria, setSelectedSubCategoria] = useState<string>('');
  const [productos, setProductos] = useState<any[]>(filteredProductos || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch categorias and subcategorias
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [catRes, subcatRes] = await Promise.all([
          fetch('/api/categorias'),
          fetch('/api/subcategorias'),
        ]);
        if (!catRes.ok || !subcatRes.ok)
          throw new Error('Error al obtener categorías');
        const catData = await catRes.json();
        const subcatData = await subcatRes.json();
        setCategorias(catData);
        setSubcategorias(subcatData);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter productos by categoria and subcategoria
  const filtered = useMemo(() => {
    let prods = filteredProductos || [];
    if (selectedCategoria) {
      prods = prods.filter(
        (p) =>
          p.categoriaId === parseInt(selectedCategoria) ||
          (p.categoria && p.categoria.id === parseInt(selectedCategoria)),
      );
    }
    if (selectedSubCategoria) {
      prods = prods.filter(
        (p) =>
          p.subcategoriaId === parseInt(selectedSubCategoria) ||
          (p.subCategoria &&
            p.subCategoria.id === parseInt(selectedSubCategoria)),
      );
    }
    return prods;
  }, [filteredProductos, selectedCategoria, selectedSubCategoria]);

  // UI: Filters
  return (
    <div>
      <div className="flex md:flex-row flex-col gap-4 mb-4 ml-4">
        <select
          value={selectedCategoria}
          onChange={(e) => {
            setSelectedCategoria(e.target.value);
            setSelectedSubCategoria('');
          }}
          className="bg-white p-2 border border-[#F4B1C7] rounded-md focus:ring-[#B695E0] focus:ring-2 text-[#7A5B47]"
        >
          <option value="">Todas las Categorías</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
        <select
          value={selectedSubCategoria}
          onChange={(e) => setSelectedSubCategoria(e.target.value)}
          className="bg-white p-2 border border-[#F4B1C7] rounded-md focus:ring-[#B695E0] focus:ring-2 text-[#7A5B47]"
          disabled={!selectedCategoria}
        >
          <option value="">Todas las Subcategorías</option>
          {selectedCategoria &&
            subcategorias
              .filter(
                (sub) =>
                  sub.categoria &&
                  (sub.categoria.id === parseInt(selectedCategoria) ||
                    sub.categoria === parseInt(selectedCategoria)),
              )
              .map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.nombre}
                </option>
              ))}
        </select>
      </div>
      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 dark:bg-slate-900 p-4 dark:border dark:border-t">
        {loading ? (
          <p className="text-[#7A5B47]">Cargando productos...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filtered.length > 0 ? (
          filtered.flatMap((producto, index) =>
            (producto.variante &&
            Array.isArray(producto.variante) &&
            producto.variante.length > 0
              ? producto.variante
              : [{ ...producto, isFallback: true }]
            ).map((variante, idx) => (
              <motion.div
                key={variante.id || `${producto.id}-fallback`}
                className="relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (index + idx) * 0.05 }}
              >
                {producto.imagenes?.length > 0 ? (
                  <Carousel
                    showThumbs={false}
                    infiniteLoop
                    className="rounded-lg"
                    onClickItem={() =>
                      navigate(`/cliente/producto/${producto.id}/informacion`)
                    }
                  >
                    {producto.imagenes.map((imagen: any, i: number) => {
                      let imageUrl = '/placeholder.jpg';
                      if (typeof imagen === 'object') {
                        if (imagen.data) {
                          imageUrl = `data:image/jpeg;base64,${imagen.data}`;
                        } else if (imagen.url) {
                          imageUrl = imagen.url.startsWith('http')
                            ? imagen.url
                            : '/' + imagen.url.replace(/^\//, '');
                        }
                      } else if (typeof imagen === 'string') {
                        imageUrl = imagen;
                      }
                      return (
                        <div
                          key={i}
                          style={{ width: '300px', height: '300px' }}
                        >
                          <img
                            src={imageUrl}
                            alt={`${producto.nombre ?? 'Producto'} - ${i + 1}`}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      );
                    })}
                  </Carousel>
                ) : (
                  <div style={{ width: '300px', height: '300px' }}>
                    <img
                      src="/placeholder.jpg"
                      alt={producto.nombre ?? 'Producto'}
                      className="rounded-lg w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div
                    onClick={() =>
                      navigate(`/cliente/producto/${producto.id}/informacion`)
                    }
                    className="cursor-pointer"
                  >
                    <h3 className="mb-2 font-semibold text-lg">
                      {producto.nombre && producto.nombre.length > 22
                        ? producto.nombre.substring(0, 22) + '...'
                        : producto.nombre ?? 'Sin nombre'}
                    </h3>
                    <div className="flex justify-between">
                      <p className="mb-2 text-gray-600">
                        {producto.marca?.nombre ?? ''}{' '}
                      </p>
                      {producto.recomendado && (
                        <BiSolidLike
                          className="text-blue-700"
                          title="Recomendado"
                        />
                      )}
                    </div>
                    {/* Variante info */}
                    {!variante.isFallback && (
                      <>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="font-bold">Talla:</span>
                          <span>{variante.talla?.nombre}</span>
                        </div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="font-bold">Stock:</span>
                          <span>{variante.stockActual}</span>
                        </div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="font-bold">Precio:</span>
                          <span>
                            {formatCurrency(variante.precioVenta || 0)}
                          </span>
                        </div>
                        {variante.porcentajeDescuento > 0 && (
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="font-bold text-green-600">
                              Descuento:
                            </span>
                            <span className="text-green-600">
                              {variante.porcentajeDescuento}%
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 mt-2 px-4 py-2 rounded w-full font-medium text-white"
                    onClick={() => {
                      addToCart({
                        ...producto,
                        ...(!variante.isFallback && {
                          precio: variante.precioVenta,
                          talla: variante.talla,
                          stockActual: variante.stockActual,
                          porcentajeDescuento: variante.porcentajeDescuento,
                        }),
                      });
                    }}
                    disabled={!variante.isFallback && variante.stockActual <= 0}
                  >
                    {!variante.isFallback && variante.stockActual <= 0
                      ? 'Sin stock'
                      : 'Agregar al carrito'}
                  </button>
                </div>
              </motion.div>
            )),
          )
        ) : (
          <p className="text-[#7A5B47]">No se encontraron productos.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
