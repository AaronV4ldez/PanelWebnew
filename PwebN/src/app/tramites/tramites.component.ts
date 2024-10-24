import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tramites',
  templateUrl: './tramites.component.html',
  styleUrls: ['./tramites.component.css']
})
export class TramitesComponent implements OnInit {
  tramites: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getTramites();
  }

  getTramites(): void {
    const url = 'https://apisprueba.fpfch.gob.mx/api/v1/panel/procedures';
    const headers = { Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjg2OSwibmFtZSI6IkFhclx1MDBmM24gVmFsZGV6IEdhcmNpYSIsImV4cCI6MTcwNDkwMTM1N30.ORsWQWxVBCjlhItaZ1e63qBIqEL1LFOjKuydoEaDBZg' };

    this.http.get<any[]>(url, { headers }).subscribe(
      (data) => {
        this.tramites = data.map(tramite => ({
          folio: tramite.folio,
          nombreUsuario: tramite.user_full_name, // Puedes cambiar esto al campo que desees
          eltramite: tramite.procedure_name,
          estatus: tramite.status,
          creadoEn: tramite.created_at,
          ultimoMovimiento: tramite.updated_at // O cualquier otro campo que quieras mostrar
        }));
      },
      (error) => {
        console.error('Error al obtener los trámites', error);
      }
    );
  }
}
