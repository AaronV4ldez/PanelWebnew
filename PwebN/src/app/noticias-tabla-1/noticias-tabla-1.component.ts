import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-noticias-tabla-1',
  templateUrl: './noticias-tabla-1.component.html',
  styleUrls: ['./noticias-tabla-1.component.css']
})
export class NoticiasTabla1Component implements OnInit {
  noticias: any[] = [];
  noticiaSeleccionada: any = null;
  noticiaAEliminar: any = null;
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 8;

  private token: string = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjg2OSwibmFtZSI6IkFhclx1MDBmM24gVmFsZGV6IFRlc3QiLCJleHAiOjE3Mjk3ODc3NjN9.T9xaWtCBSbaBC8dHBjT5_oUCIBDWSnZknSiibAgMDgQ';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.cargarNoticias();
  }

  cargarNoticias(): void {
    const headers = new HttpHeaders({ Authorization: this.token });
    this.http.get<any[]>('https://apisprueba.fpfch.gob.mx/api/v1/mkt/news', { headers }).subscribe(
      (response) => {
        this.noticias = response;
      },
      (error) => console.error('Error al cargar noticias', error)
    );
  }

  get filteredNoticias() {
    return this.noticias.filter(
      (noticia) =>
        noticia.note_title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        noticia.created_at.includes(this.searchTerm)
    );
  }

  abrirModal(noticia: any): void {
    this.noticiaSeleccionada = noticia;
    const modalElement = document.getElementById('noticiaModal');
    if (modalElement) new Modal(modalElement).show();
  }

  confirmarEliminar(noticia: any): void {
    this.noticiaAEliminar = noticia;
    const modalElement = document.getElementById('confirmarEliminarModal');
    if (modalElement) new Modal(modalElement).show();
  }

  eliminarNoticia(): void {
    const url = `https://apisprueba.fpfch.gob.mx/api/v1/panel/mkt/news/${this.noticiaAEliminar.entry_id}`;
    const headers = new HttpHeaders({ Authorization: this.token });
    this.http.delete(url, { headers }).subscribe(
      () => {
        // Eliminar noticia localmente
        this.noticias = this.noticias.filter((n) => n.entry_id !== this.noticiaAEliminar.entry_id);
  
        // Recargar noticias
        this.cargarNoticias();
  
        // Cerrar modal de confirmación si está abierto
        const confirmarEliminarModalElement = document.getElementById('confirmarEliminarModal');
        if (confirmarEliminarModalElement) {
          const confirmarEliminarModalInstance = Modal.getInstance(confirmarEliminarModalElement);
          if (confirmarEliminarModalInstance) confirmarEliminarModalInstance.hide();
        }
  
        // Mostrar modal de éxito
        const modalExitoElement = document.getElementById('eliminarExitoModal');
        if (modalExitoElement) new Modal(modalExitoElement).show();
      },
      (error) => console.error('Error al eliminar la noticia', error)
    );
  }

  exportarNoticias(): void {
    const nombreArchivo = 'noticias';
    const datos = this.noticias.map((n) => ({
      Título: n.note_title,
      'Fecha de Alta': n.created_at
    }));
    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Noticias');
    XLSX.writeFile(libro, `${nombreArchivo}.xlsx`);
  }

  safeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}