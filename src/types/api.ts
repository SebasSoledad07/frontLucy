import { Producto } from './producto';
import Cliente from './Cliente';

const API_URL =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_URL_BACKEND_PROD
    : import.meta.env.VITE_URL_BACKEND_LOCAL;

export const registrarCliente = async (cliente: Cliente): Promise<Cliente> => {
  const response = await fetch(`${API_URL}cliente/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cliente),
  });

  if (!response.ok) {
    throw new Error('Error al registrar cliente');
  }

  return await response.json();
};

export const obtenerCliente = async (id: number): Promise<Cliente> => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error('Cliente no encontrado');
  return await response.json();
};

export const obtenerTodosLosClientes = async (): Promise<Cliente[]> => {
  const response = await fetch(API_URL);
  return await response.json();
};

export const crearProducto = async (form: Producto): Promise<any> => {
  const formData = new FormData();
  formData.append('nombre', form.nombre);
  formData.append('subcategoriaId', form.subcategoriaId.toString());
  formData.append('descripcion', form.descripcion);
  formData.append('genero', form.genero);
  formData.append('activo', String(form.activo));
  formData.append('tallaId', form.tallaId.toString());
  formData.append('precioCompra', form.precioCompra.toString());
  formData.append('precioVenta', form.precioVenta.toString());
  formData.append('agregarStock', form.agregarStock.toString());
  formData.append('observaciones', form.observaciones);

  // Añadir múltiples imágenes
  form.imagenes.forEach((file) => {
    formData.append('imagenes', file);
  });

  // Añadir ids de imágenes eliminadas
  form.imagenesEliminadas.forEach((id) => {
    formData.append('imagenesEliminadas', id.toString());
  });

  const response = await fetch(`${API_URL}/api/productos`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al crear producto');
  }

  return await response.json();
};
