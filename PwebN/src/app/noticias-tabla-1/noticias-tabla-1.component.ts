import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-noticias-tabla-1',
  templateUrl: './noticias-tabla-1.component.html',
  styleUrls: ['./noticias-tabla-1.component.css']
})
export class NoticiasTabla1Component implements OnInit {
  noticias: any[] = [];

  constructor(private http: HttpClient) { }

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
}
