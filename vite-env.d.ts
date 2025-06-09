/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_URL_BACKEND_LOCAL: string;
    // Añade otras variables de entorno que estés usando aquí
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  