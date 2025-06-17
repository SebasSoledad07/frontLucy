// Use environment variables for API URL
export const API_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_URL_BACKEND_PROD + "/productos"
    : import.meta.env.VITE_URL_BACKEND_LOCAL + "/productos";

export interface ProductoResponseDto {
  id: number;
  nombre: string;
  subcategoriaId: number;
  descripcion: string;
  genero: string;
  activo: boolean;
  imagenes: string[]; // URLs de las imágenes
  tallaId: number;
  precioCompra: number;
  precioVenta: number;
  agregarStock: number;
  observaciones: string;
}
export interface Producto {
  subCategoria: any;
  id: number;
  nombre: string;
  subcategoriaId: number;
  descripcion: string;
  genero: string;
  activo: boolean;
  imagenes: File[]; // múltiples imágenes
  imagenesEliminadas: number[];
  tallaId: number;
  precioCompra: number;
  precioVenta: number;
  agregarStock: number;
  observaciones: string;
}
export async function getProductosActivos(): Promise<ProductoResponseDto[]> {
  const res = await fetch(`${API_URL}/activos`);
  if (!res.ok) throw new Error("Error al cargar productos");
  return await res.json();
}