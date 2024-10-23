import { Component } from '@angular/core';
import { AuthService } from '../auth.service';  // Asegúrate de que la ruta sea correcta
import { Router } from '@angular/router';
import { Modal } from 'bootstrap'; // Asegúrate de importar Modal de Bootstrap

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  private modalInstance: Modal | null = null; // Para manejar la instancia del modal

  constructor(private authService: AuthService, private router: Router) {}

  openLogoutModal() {
    const modalElement = document.getElementById('logoutModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement); // Inicializa el modal
      this.modalInstance.show(); // Muestra el modal
    }
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide(); // Cierra el modal
    }
  }

  confirmLogout() {
    this.closeModal(); // Cierra el modal antes de cerrar sesión
    this.authService.logout(); // Implementa este método en tu servicio de autenticación
    this.router.navigate(['/login']); // Redirige a la página de login
  }
}
