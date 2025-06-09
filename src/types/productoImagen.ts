export interface ProductoImagen {
  id: number;
  nombre: string;
  descripcion: string;
  genero: string;
  activo: boolean;
  fechaCreacion: number[]; // [YYYY, MM, DD]
  subcategoriaId: number;
  imagenes: { imagen: string }[];
  }