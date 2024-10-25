import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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

  // Token para la API
  private token: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjg2OSwibmFtZSI6IkFhclx1MDBmM24gVmFsZGV6IEdhcmNpYSIsImV4cCI6MTcwNDkwMTM1N30.ORsWQWxVBCjlhItaZ1e63qBIqEL1LFOjKuydoEaDBZg';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.cargarNoticias();
  }

  cargarNoticias(): void {
    this.http.get<any[]>('https://apisprueba.fpfch.gob.mx/api/v1/mkt/news')
      .subscribe(response => {
        this.noticias = response;
      }, error => {
        console.error('Error al cargar las noticias', error);
      });
  }

  abrirModal(noticia: any): void {
    this.noticiaSeleccionada = noticia;
    const modalElement = document.getElementById('noticiaModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  confirmarEliminar(noticia: any): void {
    this.noticiaAEliminar = noticia;
    const modalElement = document.getElementById('confirmarEliminarModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  eliminarNoticia(): void {
    if (!this.noticiaAEliminar || !this.noticiaAEliminar.entry_id) {
      return;
    }
  
    const url = `https://apisprueba.fpfch.gob.mx/api/v1/panel/mkt/news/${this.noticiaAEliminar.entry_id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  
    // Hacer la solicitud DELETE a la API
    this.http.delete(url, { headers })
      .subscribe(response => {
        console.log('Noticia eliminada correctamente', response);
  
        // Cerrar el modal de confirmación
        const modalConfirmacionElement = document.getElementById('confirmarEliminarModal');
        if (modalConfirmacionElement) {
          const modalConfirmacion = Modal.getInstance(modalConfirmacionElement);
          if (modalConfirmacion) {
            modalConfirmacion.hide();  // Cerrar el modal de confirmación
          }
        }
  
        // Recargar las noticias después de eliminar
        this.cargarNoticias();
  
        // Mostrar el modal de éxito
        const modalExito = new Modal(document.getElementById('eliminarExitoModal')!);
        modalExito.show();
      }, error => {
        console.error('Error al eliminar la noticia', error);
      });
  }
  

  safeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
