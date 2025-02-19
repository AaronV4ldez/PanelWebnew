import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as bootstrap from 'bootstrap';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-busqueda-de-informacion-archivo',
  templateUrl: './busqueda-de-informacion-archivo.component.html',
  styleUrls: ['./busqueda-de-informacion-archivo.component.css']
})
export class BusquedaDeInformacionArchivoComponent implements OnInit {
  informacion: any[] = []; // Lista completa de información
  informacionFiltrada: any[] = []; // Lista filtrada
  informacionSeleccionada: any = null;
  searchTerm: string = '';
  itemsPerPage = 10;
  currentPage = 1;
  apiUrl = 'https://tu-api.com/api/informacion'; // Cambiar por la URL real

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerInformacion();
  }

  obtenerInformacion(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        this.informacion = data;
        this.informacionFiltrada = [...this.informacion];
      },
      (error) => {
        console.error('Error al obtener la información:', error);
      }
    );
  }

  buscarInformacion(): void {
    if (!this.searchTerm.trim()) {
      this.informacionFiltrada = [...this.informacion];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.informacionFiltrada = this.informacion.filter(info =>
        info.clave.toLowerCase().includes(term) ||
        info.nombreCompleto.toLowerCase().includes(term) ||
        info.rfc.toLowerCase().includes(term) ||
        info.razonSocial.toLowerCase().includes(term) ||
        info.telefono.toLowerCase().includes(term)
      );
    }
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.informacionFiltrada = [...this.informacion];
  }

  exportarInformacion(): void {
    const nombreArchivo = prompt("Ingrese el nombre del archivo:", "informacion_archivo");

    if (nombreArchivo) {
      const datos = this.informacionFiltrada.map(info => ({
        "Clave": info.clave,
        "Puente": info.puente,
        "Nombre Completo": info.nombreCompleto,
        "SENTRI": info.sentri,
        "RFC": info.rfc,
        "Razón Social": info.razonSocial,
        "Teléfono": info.telefono
      }));

      const hoja = XLSX.utils.json_to_sheet(datos);
      const libro = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(libro, hoja, 'Información');

      XLSX.writeFile(libro, `${nombreArchivo}.xlsx`);
    }
  }

  abrirModal(info: any): void {
    this.informacionSeleccionada = info;
    const modalElement = document.getElementById('infoModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}