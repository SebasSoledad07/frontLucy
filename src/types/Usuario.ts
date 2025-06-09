import { Rol } from "./Rol";

export interface Usuario {
    id?: number;
    nombre: string;
    email: string;
    celular: string;
    password: string;
    direccion:string
    cedula: string;
    activo: boolean;
    rol: Rol;
  }