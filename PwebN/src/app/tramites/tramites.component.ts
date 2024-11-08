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
  tramitesOriginales: any[] = []; // Nueva propiedad para almacenar datos originales
  filtroForm: FormGroup;
  filtroTramiteModal: any;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    // Inicializar el formulario de filtro
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

  // Obtener trámites desde la API
  getTramites(): void {
    const url = 'https://apisprueba.fpfch.gob.mx/api/v1/panel/procedures';
    const headers = { Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjg2OSwibmFtZSI6IkFhclx1MDBmM24gVmFsZGV6IEdhcmNpYSIsImV4cCI6MTcwNDkwMTM1N30.ORsWQWxVBCjlhItaZ1e63qBIqEL1LFOjKuydoEaDBZg' };

    this.http.get<any[]>(url, { headers }).subscribe(
      (data) => {
        // Guardar los datos originales y mostrarlos en la tabla
        this.tramitesOriginales = data.map(tramite => ({
          folio: tramite.folio,
          nombreUsuario: tramite.user_full_name,
          eltramite: tramite.procedure_name,
          estatus: tramite.status,
          creadoEn: tramite.created_at,
          ultimoMovimiento: tramite.updated_at
        }));
        this.tramites = [...this.tramitesOriginales]; // Copiar los datos originales para trabajar con el filtro
      },
      (error) => {
        console.error('Error al obtener los trámites', error);
      }
    );
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
    this.tramites = [...this.tramitesOriginales]; // Restaurar los datos originales
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
  
      // Filtrado por rango de fechas (solo si se selecciona alguna fecha)
      let coincideFecha = true;
      if (filtroData.fechaDesde || filtroData.fechaHasta) {
        const fechaDesde = filtroData.fechaDesde ? this.convertirFecha(filtroData.fechaDesde) : null;
        const fechaHasta = filtroData.fechaHasta ? this.convertirFecha(filtroData.fechaHasta) : null;
  
        // Convertir el valor de `ultimoMovimiento` usando la función personalizada
        const fechaUltimoMovimiento = this.convertirFecha(tramite.ultimoMovimiento);
  
        // Comparar fechas solo si `fechaDesde` o `fechaHasta` existen
        coincideFecha = (!fechaDesde || fechaUltimoMovimiento >= fechaDesde) &&
                        (!fechaHasta || fechaUltimoMovimiento <= fechaHasta);
      }
  
      return coincideUsuario && coincideTipoTramite && coincideEstatus && coincideFecha;
    });
  }
  
  // Función para convertir la fecha correctamente
  convertirFecha(fechaStr: string): Date {
    // Tratar de convertir una fecha con formato `YYYY-MM-DD HH:mm:ss` o `YYYY-MM-DD`
    const partes = fechaStr.split(' ');
    const fechaParte = partes[0]; // `YYYY-MM-DD`
    return new Date(fechaParte); // Crear un objeto `Date` solo con la fecha
  }
   
  

normalizeString(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}


}
