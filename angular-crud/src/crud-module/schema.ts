// Exportación de una interfaz llamada "CrudOptions" que define las opciones de generación de código.
export interface CrudOptions {
  name: string;        // El nombre del módulo CRUD que se va a generar.
  appRoot: string;     // Ruta al directorio raíz de la aplicación.
  path: string;        // Ruta al directorio donde se generará el módulo CRUD.
  sourceDir: string;   // Directorio de origen para la generación.
  project: string;     // Nombre del proyecto de Angular en el que se generará el módulo.
  module: string;      // Nombre del módulo en el que se insertará el módulo CRUD.
  export: boolean;     // Indica si se debe exportar el módulo CRUD desde el módulo.
  model: string;       // Nombre del modelo de datos asociado al módulo CRUD.
  style: string;       // Estilo de las plantillas (por ejemplo, "bootstrap" o "material").
}
