export interface ServicioMantel {
  id: number;
  nombre: string;
  descripcion: string;
  tipoTela: string;
  color: string;
  tamaño: string;
  precioAlquiler: number;
  precioVenta?: number;
  stockDisponible: number;
  estado: 'disponible' | 'agotado' | 'mantenimiento';
  imagen?: string;
  categoria: string;
}

export interface EmpresaManteleria {
  id: number;
  nombre: string;
  ruc: string;
  contacto: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  descripcion?: string;
  calificacion: number;
  servicios: ServicioMantel[];
  tiempoEntrega: number;
  activo: boolean;
  fechaRegistro: Date;
}