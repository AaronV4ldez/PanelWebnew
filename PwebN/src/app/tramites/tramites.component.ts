import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-tramites',
  templateUrl: './tramites.component.html',
  styleUrls: ['./tramites.component.css']
})
export class TramitesComponent implements OnInit {
  tramites: any[] = [];
  tramitesOriginales: any[] = [];
  filtroForm: FormGroup;
  filtroTramiteModal: any;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  Math = Math;

  // Propiedades para modal de detalle
  modalDetalleTramite: any;
  seccionActual: string = 'detalles'; // Por defecto inicia en 'detalles'
  tramiteSeleccionado: any = null;
  archivosAdjuntos: any[] = []; // Aquí se cargarán los archivos adjuntos para el trámite
  archivoSeleccionado: any = null;

  usuariosTramitadores: any[] = [];
  modalAsignacion: any;
  tramitesSeleccionados: any[] = [];
  usuarioSeleccionadoId: number | null = null;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.filtroForm = this.fb.group({
      usuario: [''],
      tipoTramite: [''],
      estatus: [''],
      fechaDesde: [''],
      fechaHasta: ['']
    });
  }

  ngOnInit(): void {
    this.getTramites();
    this.getUsuariosTramitadores();
  }

  getTramites(): void {
    const url = 'https://apisprueba.fpfch.gob.mx/api/v1/panel/procedures';
    const headers = { Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjg2OSwibmFtZSI6IkFhclx1MDBmM24gVmFsZGV6IEdhcmNpYSIsImV4cCI6MTcwNDkwMTM1N30.ORsWQWxVBCjlhItaZ1e63qBIqEL1LFOjKuydoEaDBZg' };

    this.http.get<any[]>(url, { headers }).subscribe(
      (data) => {
        this.tramitesOriginales = data.map(tramite => ({
          folio: tramite.folio,
          nombreUsuario: tramite.user_full_name,
          eltramite: tramite.procedure_name,
          estatus: tramite.status,
          creadoEn: tramite.created_at,
          ultimoMovimiento: tramite.updated_at,
          asesor: tramite.asesor || 'Sin asignar',
          selected: false, // Para selección de trámites
          // Información adicional para modal
          sentri: tramite.sentri || null,
          vencimientoSentri: tramite.vencimiento_sentri || null,
          colorVehiculo: tramite.color_vehiculo || null,
          comentario: tramite.comentario || null,
          fechaCita: tramite.fecha_cita || null,
          razonSocial: tramite.razon_social || null,
          rfc: tramite.rfc || null,
          domicilioFiscal: tramite.domicilio_fiscal || null,
          correoFiscal: tramite.correo_fiscal || null,
          telefonoFiscal: tramite.telefono_fiscal || null,
          estado: tramite.estado || null,
          codigoPostal: tramite.codigo_postal || null,
          marcaVehiculo: tramite.marca_vehiculo || null,
          modeloVehiculo: tramite.modelo_vehiculo || null,
          tag: tramite.tag || null
        }));
        this.tramites = [...this.tramitesOriginales];
      },
      (error) => {
        console.error('Error al obtener los trámites', error);
      }
    );
  }

  getUsuariosTramitadores(): void {
    const url = 'https://apisprueba.fpfch.gob.mx/api/v1/panel/users/web-users';
    const headers = { Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjg2OSwibmFtZSI6IkFhclx1MDBmM24gVmFsZGV6IEdhcmNpYSIsImV4cCI6MTcwNDkwMTM1N30.ORsWQWxVBCjlhItaZ1e63qBIqEL1LFOjKuydoEaDBZg' };

    this.http.get<any[]>(url, { headers }).subscribe(
      (data) => {
        this.usuariosTramitadores = data.filter(user => user.usertype === 2).map(user => ({
          id: user.id,
          fullname: user.fullname
        }));
      },
      (error) => {
        console.error('Error al obtener los usuarios tramitadores', error);
      }
    );
  }

  abrirModalAsignacion(): void {
    this.tramitesSeleccionados = this.tramites.filter(tramite => tramite.selected);
    if (this.tramitesSeleccionados.length === 0) {
      alert('Selecciona al menos un trámite para asignar o reasignar.');
      return;
    }

    const modalElement = document.getElementById('modalAsignacion');
    if (modalElement) {
      this.modalAsignacion = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
      this.modalAsignacion.show();
    } else {
      console.error('No se encontró el elemento del modal de asignación.');
    }
  }

  abrirDetalleTramite(tramite: any): void {
    this.tramiteSeleccionado = tramite;

    // Simulación de archivos adjuntos (reemplazar con datos reales de la API)
    this.archivosAdjuntos = [
        { nombre: 'ID oficial (frente)', aprobado: true, rechazado: false, motivoRechazo: null, url: 'url_del_documento' },
        { nombre: 'Póliza de seguro', aprobado: false, rechazado: true, motivoRechazo: 'FOTOGRAFÍA BORROSA', url: 'url_del_documento' },
        // Otros documentos...
    ];

    this.seccionActual = 'detalles'; // Reiniciar a la vista de detalles
    const modalElement = document.getElementById('detalleTramiteModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
}
cambiarSeccion(seccion: string): void {
  this.seccionActual = seccion;
}

  asignarTramites(): void {
    if (!this.usuarioSeleccionadoId) {
      alert('Selecciona un usuario para asignar los trámites.');
      return;
    }

    const url = 'https://apisprueba.fpfch.gob.mx/api/v1/panel/procedures/assign';
    const headers = { Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjg2OSwibmFtZSI6IkFhclx1MDBmM24gVmFsZGV6IEdhcmNpYSIsImV4cCI6MTcwNDkwMTM1N30.ORsWQWxVBCjlhItaZ1e63qBIqEL1LFOjKuydoEaDBZg' };

    const body = {
      userId: this.usuarioSeleccionadoId,
      tramiteIds: this.tramitesSeleccionados.map(tramite => tramite.folio)
    };

    this.http.post(url, body, { headers }).subscribe(
      () => {
        this.tramitesSeleccionados.forEach(tramite => {
          tramite.asesor = this.usuariosTramitadores.find(user => user.id === this.usuarioSeleccionadoId)?.fullname;
        });
        this.modalAsignacion.hide();
        this.usuarioSeleccionadoId = null;
        alert('Trámites asignados exitosamente.');
      },
      (error) => {
        console.error('Error al asignar trámites', error);
      }
    );
  }

  cambiarPagina(pagina: number): void {
    this.currentPage = pagina;
  }

  exportarExcel(): void {
    const nombreArchivo = prompt('Ingrese el nombre del archivo:', 'tramites');
    if (nombreArchivo) {
      const tramitesConEncabezados = this.tramites.map(tramite => ({
        Folio: tramite.folio,
        'Nombre de usuario': tramite.nombreUsuario,
        Trámite: tramite.eltramite,
        Estatus: tramite.estatus,
        'Último movimiento': tramite.ultimoMovimiento,
        Asesor: tramite.asesor
      }));

      const hojaTrabajo: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tramitesConEncabezados);
      const libro: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(libro, hojaTrabajo, 'Trámites');

      const archivo = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([archivo], { type: 'application/octet-stream' }), `${nombreArchivo}.xlsx`);
    } else {
      console.log('Exportación cancelada');
    }
  }

  openFiltroModal(): void {
    const modalElement = document.getElementById('filtroTramiteModal');
    if (modalElement) {
      this.filtroTramiteModal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
      this.filtroTramiteModal.show();
    } else {
      console.error('No se encontró el elemento del modal');
    }
  }

  onBuscar(): void {
    const filtroData = this.filtroForm.value;
    this.aplicarFiltro(filtroData);
    this.filtroTramiteModal.hide();
  }

  onLimpiar(): void {
    this.filtroForm.reset();
    this.tramites = [...this.tramitesOriginales];
  }

  aplicarFiltro(filtroData: any): void {
    this.tramites = this.tramitesOriginales.filter(tramite => {
      const coincideUsuario = filtroData.usuario
        ? tramite.nombreUsuario.toLowerCase().includes(filtroData.usuario.toLowerCase())
        : true;

      const coincideTipoTramite = filtroData.tipoTramite
        ? this.normalizeString(tramite.eltramite) === this.normalizeString(filtroData.tipoTramite)
        : true;

      const coincideEstatus = filtroData.estatus
        ? tramite.estatus === filtroData.estatus
        : true;

      let coincideFecha = true;
      if (filtroData.fechaDesde || filtroData.fechaHasta) {
        const fechaDesde = filtroData.fechaDesde ? this.convertirFecha(filtroData.fechaDesde) : null;
        const fechaHasta = filtroData.fechaHasta ? this.convertirFecha(filtroData.fechaHasta) : null;
        const fechaUltimoMovimiento = this.convertirFecha(tramite.ultimoMovimiento);
        coincideFecha = (!fechaDesde || fechaUltimoMovimiento >= fechaDesde) &&
                        (!fechaHasta || fechaUltimoMovimiento <= fechaHasta);
      }

      return coincideUsuario && coincideTipoTramite && coincideEstatus && coincideFecha;
    });
  }

  convertirFecha(fechaStr: string): Date {
    const partes = fechaStr.split(' ');
    const fechaParte = partes[0];
    return new Date(fechaParte);
  }

  normalizeString(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  get filteredTramites(): any[] {
    return this.tramites;
  }

  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.tramites.forEach(tramite => tramite.selected = isChecked);
  }
  abrirVistaPrevia(archivo: any): void {
    // Simulación de vista previa, en producción deberías cargar la URL del archivo adjunto
    const modalElement = document.getElementById('vistaPreviaModal');
    this.archivoSeleccionado = archivo; // Guarda el archivo seleccionado para mostrar detalles en el modal
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  
  aprobarArchivo(archivo: any): void {
    // Lógica para aprobar archivo
    archivo.aprobado = true;
    archivo.rechazado = false;
    archivo.motivoRechazo = null;
    alert(`El archivo "${archivo.nombre}" ha sido aprobado.`);
  }
  
  rechazarArchivo(archivo: any): void {
    // Lógica para rechazar archivo
    const motivo = prompt(`Especifica el motivo de rechazo para el archivo "${archivo.nombre}":`);
    if (motivo) {
      archivo.aprobado = false;
      archivo.rechazado = true;
      archivo.motivoRechazo = motivo;
      alert(`El archivo "${archivo.nombre}" ha sido rechazado con el motivo: "${motivo}".`);
    }
  }
}