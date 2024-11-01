import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
          nombreUsuario: tramite.user_full_name,
          eltramite: tramite.procedure_name,
          estatus: tramite.status,
          creadoEn: tramite.created_at,
          ultimoMovimiento: tramite.updated_at
        }));
      },
      (error) => {
        console.error('Error al obtener los trámites', error);
      }
    );
  }

  exportarExcel(): void {
    const hojaTrabajo: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tramites);
    const libro: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hojaTrabajo, 'Trámites');
    
    const archivo = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([archivo], { type: 'application/octet-stream' }), 'tramites.xlsx');
  }
}
