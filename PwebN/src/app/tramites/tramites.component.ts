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
  Math = Math; // Para usar Math en la plantilla

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
          ultimoMovimiento: tramite.updated_at
        }));
        this.tramites = [...this.tramitesOriginales];
      },
      (error) => {
        console.error('Error al obtener los trámites', error);
      }
    );
  }

  // Cambia la página actual
  cambiarPagina(pagina: number) {
    this.currentPage = pagina;
  }

  // Exportar datos a Excel
  exportarExcel(): void {
    const nombreArchivo = prompt("Ingrese el nombre del archivo:", "tramites");

    if (nombreArchivo) {
      const tramitesConEncabezados = this.tramites.map(tramite => ({
        "Folio": tramite.folio,
        "Nombre de usuario": tramite.nombreUsuario,
        "Trámite": tramite.eltramite,
        "Estatus": tramite.estatus,
        "Último movimiento": tramite.ultimoMovimiento
      }));

      const hojaTrabajo: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tramitesConEncabezados);
      const libro: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(libro, hojaTrabajo, 'Trámites');

      const archivo = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([archivo], { type: 'application/octet-stream' }), `${nombreArchivo}.xlsx`);
    } else {
      console.log("Exportación cancelada");
    }
  }

  // Abrir el modal de filtro
  openFiltroModal(): void {
    const modalElement = document.getElementById('filtroTramiteModal');
    if (modalElement) {
      this.filtroTramiteModal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
      this.filtroTramiteModal.show();
    } else {
      console.error("No se encontró el elemento del modal");
    }
  }

  // Aplicar filtro y cerrar modal
  onBuscar(): void {
    const filtroData = this.filtroForm.value;
    this.aplicarFiltro(filtroData);
    this.filtroTramiteModal.hide();
  }

  // Limpiar los campos del formulario de filtro y restaurar los datos originales
  onLimpiar(): void {
    this.filtroForm.reset();
    this.tramites = [...this.tramitesOriginales];
  }

  // Lógica para aplicar el filtro en los trámites
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
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  // Filtrado de trámites para la paginación
  get filteredTramites() {
    return this.tramites;
  }
}