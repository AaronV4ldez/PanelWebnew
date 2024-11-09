import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

declare var bootstrap: any; // Para usar Bootstrap JS en el componente

@Component({
  selector: 'app-usuarios-de-pweb',
  templateUrl: './usuarios-de-pweb.component.html',
  styleUrls: ['./usuarios-de-pweb.component.css']
})
export class UsuariosDePwebComponent implements OnInit {
  usuarios: any[] = [];
  usuarioSeleccionado: any = {}; // Usuario actualmente seleccionado para edición
  verificarPassword: string = ''; // Campo para verificar la contraseña
  currentPage: number = 1;
  itemsPerPage: number = 8;
  searchTerm: string = '';
  Math = Math;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    const url = 'https://apisprueba.fpfch.gob.mx/api/v1/panel/users/web-users';
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

  get filteredUsuarios() {
    return this.usuarios.filter(usuario => 
      usuario.fullname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      usuario.userlogin.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      usuario.phone.includes(this.searchTerm)
    );
  }

  obtenerRol(usertype: number): string {
    switch (usertype) {
      case 1: return 'Usuario';
      case 2: return 'Tramitador';
      case 3: return 'Administrador';
      case 4: return 'Super Admin';
      case 5: return 'Comunicación Social';
      default: return 'Usuario';
    }
  }

  // Abre el modal de edición con los datos del usuario seleccionado
  abrirModalEdicion(usuario: any) {
    this.usuarioSeleccionado = { ...usuario }; // Copia los datos del usuario seleccionado
    const modalElement = document.getElementById('editUserModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  // Confirma la edición del usuario
  confirmarEdicion() {
    // Aquí puedes agregar la lógica para actualizar los datos en la base de datos si fuera necesario
    console.log('Usuario editado:', this.usuarioSeleccionado);
    const modalElement = document.getElementById('editUserModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();
    }
  }

  exportarExcel(): void {
    const nombreArchivo = prompt("Ingrese el nombre del archivo:", "usuarios_panel_web");

    if (nombreArchivo) {
      const usuariosConEncabezados = this.usuarios.map(usuario => ({
        "Nombre de usuario": usuario.fullname,
        "Correo electrónico": usuario.userlogin,
        "Teléfono": usuario.phone,
        "Rol": this.obtenerRol(usuario.usertype)
      }));

      const hojaTrabajo: XLSX.WorkSheet = XLSX.utils.json_to_sheet(usuariosConEncabezados);
      const libro: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(libro, hojaTrabajo, 'Usuarios Panel Web');

      const archivo = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([archivo], { type: 'application/octet-stream' }), `${nombreArchivo}.xlsx`);
    } else {
      console.log("Exportación cancelada");
    }
  }
}