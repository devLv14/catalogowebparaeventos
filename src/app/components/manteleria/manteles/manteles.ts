import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SimpleTableComponent } from '../../shared/data-table/data-table';
import { NotificationComponent, Notification } from '../../shared/notification/notification';

// Mover el servicio arriba del componente
import { Injectable } from '@angular/core';
import { Card } from '../../shared/card/card';
@Injectable({
  providedIn: 'root',
})
export class ManteleriaService {
  // Aquí irían tus llamadas HTTP reales
  constructor() {}
}

@Component({
  selector: 'app-manteleria',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleTableComponent,
    Card,
    NotificationComponent,
  ],
  templateUrl: './manteles.html',
  styleUrls: ['./manteles.css'],
})
export class ManteleriaComponent implements OnInit {
  marcas = [
    { imagen: 'assets/marca1.jpg', url: 'https://www.facebook.com/tienda.de.arte.dc/' },
    {
      imagen: 'assets/marca2.jpg',
      url: 'https://www.facebook.com/p/Dekorfactory-100077738053069/',
    },
    {
      imagen: 'assets/marca3.jpg',
      url: 'https://www.facebook.com/decoracioneseventosmm/?locale=es_LA',
    },
  ];

  private manteleriaService = inject(ManteleriaService);
  private fb = inject(FormBuilder);

  // Variables del componente
  empresas: any[] = [];
  empresaSeleccionada: any = null;
  modoEdicion: boolean = false;
  loading: boolean = false;
  notifications: Notification[] = [];

  // Configuración simple para la tabla
  tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'contacto', label: 'Contacto' },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'ubicacion', label: 'Ubicación' },
    { key: 'calificacion', label: 'Rating' },
    { key: 'activo', label: 'Estado' },
  ];

  // Formularios
  empresaForm: FormGroup;

  constructor() {
    // Inicializar formulario de empresa
    this.empresaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      contacto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      ubicacion: ['', Validators.required],
      tiempoEntrega: [24, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  // Cargar datos de ejemplo
  cargarEmpresas(): void {
    this.loading = true;

    // Simular carga de API
    setTimeout(() => {
      this.empresas = [
        {
          id: 1,
          nombre: 'Manteles Elegantes S.A.',
          descripcion: 'Especialistas en mantelería fina para eventos corporativos y bodas de lujo',
          contacto: 'Juan Pérez',
          email: 'contacto@manteleselegantes.com',
          telefono: '+593 4 2345678',
          ubicacion: 'Norte de Guayaquil',
          calificacion: 4.8,
          activo: 'Activo',
          tiempoEntrega: 24,
          servicios: [
            {
              id: 1,
              nombre: 'Mantel Blanco Premium',
              tipoTela: 'Algodón',
              color: 'Blanco',
              tamaño: '180x300 cm',
              precioAlquiler: 89.99,
              stockDisponible: 50,
            },
          ],
        },
        {
          id: 2,
          nombre: 'Telas Finas Corporativo',
          descripcion: 'Proveedores de mantelería empresarial y servicios de decoración',
          contacto: 'María González',
          email: 'ventas@telasfinas.com',
          telefono: '+593 4 2345999',
          ubicacion: 'Centro de Guayaquil',
          calificacion: 4.5,
          activo: 'Activo',
          tiempoEntrega: 48,
          servicios: [
            {
              id: 2,
              nombre: 'Juego Completo Ejecutivo',
              tipoTela: 'Polyster',
              color: 'Negro',
              tamaño: 'Juego Completo',
              precioAlquiler: 129.99,
              stockDisponible: 25,
            },
          ],
        },
      ];
      this.loading = false;
    }, 1500);
  }

  // CRUD Operations
  crearEmpresa(): void {
    if (this.empresaForm.valid) {
      const nuevaEmpresa = {
        id: this.empresas.length > 0 ? Math.max(...this.empresas.map((e) => e.id)) + 1 : 1,
        ...this.empresaForm.value,
        calificacion: 0,
        activo: 'Activo',
        servicios: [],
      };

      this.empresas.push(nuevaEmpresa);
      this.empresaForm.reset();
      this.mostrarMensaje('Empresa creada exitosamente', 'success');
    }
  }

  actualizarEmpresa(): void {
    if (this.empresaForm.valid && this.empresaSeleccionada) {
      const index = this.empresas.findIndex((e) => e.id === this.empresaSeleccionada.id);
      if (index !== -1) {
        this.empresas[index] = {
          ...this.empresaSeleccionada,
          ...this.empresaForm.value,
        };
        this.mostrarMensaje('Empresa actualizada exitosamente', 'info');
        this.cancelarEdicion();
      }
    }
  }

  eliminarEmpresa(empresa: any): void {
    if (confirm(`¿Está seguro de eliminar la empresa "${empresa.nombre}"?`)) {
      this.empresas = this.empresas.filter((e) => e.id !== empresa.id);
      this.mostrarMensaje('Empresa eliminada exitosamente', 'warning');
    }
  }

  // Manejar acciones de la tabla
  onTableAction(event: { action: string; item: any }): void {
    const empresa = event.item;

    switch (event.action) {
      case 'edit':
        this.seleccionarEmpresa(empresa);
        break;
      case 'delete':
        this.eliminarEmpresa(empresa);
        break;
    }
  }

  seleccionarEmpresa(empresa: any): void {
    this.empresaSeleccionada = empresa;
    this.modoEdicion = true;
    this.empresaForm.patchValue(empresa);
  }

  cancelarEdicion(): void {
    this.empresaSeleccionada = null;
    this.modoEdicion = false;
    this.empresaForm.reset();
  }

  private mostrarMensaje(
    mensaje: string,
    tipo: 'success' | 'error' | 'info' | 'warning' = 'success'
  ): void {
    const notification: Notification = {
      message: mensaje,
      type: tipo,
      duration: 3000,
    };

    this.notifications.push(notification);

    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
      const index = this.notifications.indexOf(notification);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    }, 3000);
  }
}
