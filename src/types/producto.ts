
export const API_URL = "http://localhost:8080/api/productos";
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