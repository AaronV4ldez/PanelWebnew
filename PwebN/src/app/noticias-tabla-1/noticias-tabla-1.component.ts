import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  safeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
