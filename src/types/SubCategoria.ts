import { Categoria } from "./Categoria";

export interface SubCategoria {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: Categoria;
}
