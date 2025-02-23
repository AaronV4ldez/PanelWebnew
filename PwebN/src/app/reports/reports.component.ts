import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  logs: any[] = []; // Almacena los logs
  searchTerm: string = ''; // Término de búsqueda
  currentPage: number = 1;
  itemsPerPage: number = 8; // Items por página
  Math = Math; // Permite el uso de Math en el HTML
  eventoSeleccionado: any = {}; // Evento seleccionado para mostrar en el modal

  private token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjg2OSwibmFtZSI6IkFhclx1MDBmM24gVmFsZGV6IFRlc3QiLCJleHAiOjE3Mjk3ODc3NjN9.T9xaWtCBSbaBC8dHBjT5_oUCIBDWSnZknSiibAgMDgQ';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getLogs();
  }

  getLogs() {
    const url = 'https://apisprueba.fpfch.gob.mx/api/v1/analytics/events/logs/2';
    const headers = new HttpHeaders({
      'Authorization': this.token
    });

    this.http.get<any[]>(url, { headers }).subscribe(
      (data) => {
        // Almacenar los datos en orden inverso, del más reciente al más antiguo
        this.logs = data.reverse();
      },
      (error) => {
        console.error('Error al obtener los logs:', error);
      }
    );
  }

  // Método para filtrar los logs
  get filteredLogs() {
    // Filtra los logs en función del término de búsqueda y devuelve en orden inverso
    return this.logs
      .filter(log =>
        (log.event_date_time && log.event_date_time.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (log.log_comments && log.log_comments.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (log.event_name && log.event_name.toLowerCase().includes(this.searchTerm.toLowerCase()))
      )
      .reverse(); // Asegura que el último registro esté en primer lugar
  }

  // Cambiar de página en la paginación
  cambiarPagina(pagina: number) {
    this.currentPage = pagina;
  }

// Exportar datos a Excel
exportarExcel(): void {
  const nombreArchivo = prompt("Ingrese el nombre del archivo:", "Reportes_logs");

  if (nombreArchivo) {
    // Imprimir el JSON completo que se exportará en la consola
    console.log('JSON completo que se exporta:', this.logs);

    // Incluir todo el contenido del JSON
    const logsConEncabezados = this.logs.map(log => ({
      "ID Evento": log.entry_id,
      "Evento": log.event_name,
      "Comentarios": log.log_comments,
      "Fecha y hora": log.event_date_time,
      "Plataforma": log.client_platform_name,
      "Versión OS": log.client_os_version,
      "Versión App": log.client_app_version,
      "Nombre del Componente": log.component_name,
      "ID App": log.id_app
    }));

    // Crear hoja de Excel y agregar encabezados
    const hojaTrabajo: XLSX.WorkSheet = XLSX.utils.json_to_sheet(logsConEncabezados);
    const libro: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hojaTrabajo, 'Reportes_logs_eventos');

    // Generar archivo Excel
    const archivo = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([archivo], { type: 'application/octet-stream' }), `${nombreArchivo}.xlsx`);
  } else {
    console.log("Exportación cancelada");
  }
}

  // Abre el modal de detalles con el evento seleccionado
  abrirModalDetalle(log: any): void {
    this.eventoSeleccionado = log;
    const modalElement = document.getElementById('detalleEventoModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}