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
  usuarioSeleccionado: any = {}; // Usuario actualmente seleccionado para edición o eliminación
  currentPage: number = 1;
  itemsPerPage: number = 8;
  searchTerm: string = '';
  Math = Math;

  private token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjg2OSwibmFtZSI6IkFhclx1MDBmM24gVmFsZGV6IEdhcmNpYSIsImV4cCI6MTcwNDkwMTM1N30.ORsWQWxVBCjlhItaZ1e63qBIqEL1LFOjKuydoEaDBZg';
  private successModalInstance: any; // Instancia del modal de éxito

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    const url = 'https://apisprueba.fpfch.gob.mx/api/v1/panel/users/web-users';
    const headers = new HttpHeaders({
      'Authorization': this.token
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

  // Confirma la edición del usuario y envía los datos a la API
  confirmarEdicion() {
    const payload = {
      user_id: this.usuarioSeleccionado.id,
      full_name: this.usuarioSeleccionado.fullname,
      phone_number: this.usuarioSeleccionado.phone,
      user_type_id: this.usuarioSeleccionado.usertype
    };

    const url = 'https://apisprueba.fpfch.gob.mx/api/v1/panel/users/update';
    const headers = new HttpHeaders({
      'Authorization': this.token,
      'Content-Type': 'application/json'
    });

    this.http.put(url, payload, { headers }).subscribe(
      (response) => {
        console.log('Usuario actualizado:', response);
        // Actualizar el usuario localmente
        const index = this.usuarios.findIndex(u => u.id === this.usuarioSeleccionado.id);
        if (index !== -1) {
          this.usuarios[index] = { ...this.usuarioSeleccionado };
        }

        // Cerrar el modal de edición
        const modalElement = document.getElementById('editUserModal');
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          modalInstance.hide();
        }

        // Mostrar el modal de éxito
        this.mostrarModalExito();
      },
      (error) => {
        console.error('Error al actualizar el usuario:', error);
      }
    );
  }

  mostrarModalExito() {
    const modalElement = document.getElementById('successModal');
    if (modalElement) {
      this.successModalInstance = new bootstrap.Modal(modalElement);
      this.successModalInstance.show();
    }
  }

  cerrarModalExito() {
    if (this.successModalInstance) {
      this.successModalInstance.hide(); // Oculta el modal
      const modalBackdrop = document.querySelector('.modal-backdrop'); // Busca el fondo oscuro
      if (modalBackdrop) {
        modalBackdrop.remove(); // Elimina el fondo oscuro si sigue presente
      }
      this.successModalInstance = null; // Limpia la referencia
    }
  }

  abrirModalConfirmacionEliminar(usuario: any) {
    this.usuarioSeleccionado = usuario; // Establece el usuario seleccionado
    const modalElement = document.getElementById('confirmDeleteModal');
    if (modalElement) {
      const confirmDeleteModal = new bootstrap.Modal(modalElement);
      confirmDeleteModal.show();
    }
  }

  confirmarEliminacion() {
    const url = `https://apisprueba.fpfch.gob.mx/api/v1/panel/users/delete/${this.usuarioSeleccionado.id}`;
    const headers = new HttpHeaders({
      'Authorization': this.token
    });

    this.http.delete(url, { headers }).subscribe(
      () => {
        // Eliminar el usuario de la lista localmente
        this.usuarios = this.usuarios.filter(u => u.id !== this.usuarioSeleccionado.id);
        
        // Cerrar el modal de confirmación
        const confirmDeleteModal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
        if (confirmDeleteModal) {
          confirmDeleteModal.hide();
        }

        // Mostrar el modal de éxito
        this.mostrarModalExito();
      },
      (error) => {
        console.error('Error al eliminar usuario:', error);
      }
    );
  }

  exportarExcel(): void {
    const nombreArchivo = prompt("Ingrese el nombre del archivo:", "usuarios_panel_web");

    if (nombreArchivo) {
      const usuariosConEncabezados = this.usuarios.map(usuario => ({
        "Nombre de usuario": usuario.fullname,
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