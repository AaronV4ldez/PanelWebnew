import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-usuarios-de-app',
  templateUrl: './usuarios-de-app.component.html',
  styleUrls: ['./usuarios-de-app.component.css']
})
export class UsuariosDeAppComponent implements OnInit {
  usuarios: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  Math = Math; // Para usar Math en la plantilla
  searchTerm: string = ''; // Nueva variable para la búsqueda

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    const url = 'https://apisprueba.fpfch.gob.mx/api/v1/panel/users/mobile-users';
    const headers = new HttpHeaders({
      'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjg2OSwibmFtZSI6IkFhclx1MDBmM24gVmFsZGV6IEdhcmNpYSIsImV4cCI6MTcwNDkwMTM1N30.ORsWQWxVBCjlhItaZ1e63qBIqEL1LFOjKuydoEaDBZg`
    });

    this.http.get<any[]>(url, { headers }).subscribe(
      (data) => {
        this.usuarios = data.reverse(); // Invierte el orden de los usuarios
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  cambiarPagina(pagina: number) {
    this.currentPage = pagina;
  }

  // Método para filtrar los usuarios
  get filteredUsuarios() {
    return this.usuarios.filter(usuario => 
      usuario.fullname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      usuario.userlogin.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      usuario.phone.includes(this.searchTerm)
    );
  }
}