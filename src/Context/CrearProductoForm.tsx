import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

import { useProductoContext } from '../Context/ProductoContext';

const CrearProductoForm: React.FC = () => {
  const { token, fetchProductos, categorias } = useProductoContext();
  const BASE_URL =
    import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_URL_BACKEND_PROD
      : import.meta.env.VITE_URL_BACKEND_LOCAL;

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [genero, setGenero] = useState('UNISEX');
  const [activo, setActivo] = useState(true);
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [subcategoriaId, setSubcategoriaId] = useState<number>(0);
  const [precioCompra, setPrecioCompra] = useState<number>(0);
  const [precioVenta, setPrecioVenta] = useState<number>(0);
  const [tallaId, setTallaId] = useState<number>(0);
  const [agregarStock, setAgregarStock] = useState<number>(0);
  const [observaciones, setObservaciones] = useState('');

  const handleImagenesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagenes(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('genero', genero);
    formData.append('activo', String(activo));
    formData.append('subcategoriaId', String(subcategoriaId));
    formData.append('precioCompra', String(precioCompra));
    formData.append('precioVenta', String(precioVenta));
    formData.append('tallaId', String(tallaId));
    formData.append('agregarStock', String(agregarStock));
    formData.append('observaciones', observaciones);

    imagenes.forEach((img) => {
      formData.append('imagenes', img);
    });

    try {
      await axios.post(`${BASE_URL}/api/productos`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Producto creado exitosamente');
      fetchProductos();
    } catch (error: any) {
      console.error('Error al crear el producto:', error);
      alert(error.response?.data?.error || 'Error desconocido');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />
      <select value={genero} onChange={(e) => setGenero(e.target.value)}>
        <option value="MASCULINO">Masculino</option>
        <option value="FEMENINO">Femenino</option>
        <option value="UNISEX">Unisex</option>
      </select>
      <select
        value={subcategoriaId}
        onChange={(e) => setSubcategoriaId(Number(e.target.value))}
      >
        <option value={0}>Seleccione Subcategoría</option>
        {categorias?.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.nombre}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Precio Compra"
        value={precioCompra}
        onChange={(e) => setPrecioCompra(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Precio Venta"
        value={precioVenta}
        onChange={(e) => setPrecioVenta(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Talla ID"
        value={tallaId}
        onChange={(e) => setTallaId(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Stock"
        value={agregarStock}
        onChange={(e) => setAgregarStock(Number(e.target.value))}
      />
      <textarea
        placeholder="Observaciones"
        value={observaciones}
        onChange={(e) => setObservaciones(e.target.value)}
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImagenesChange}
      />
      <label>
        Activo:
        <input
          type="checkbox"
          checked={activo}
          onChange={(e) => setActivo(e.target.checked)}
        />
      </label>
      <button type="submit">Crear Producto</button>
    </form>
  );
};

export default CrearProductoForm;
