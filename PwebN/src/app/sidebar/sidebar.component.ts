import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  submenuOpen: boolean = false; // Controla el estado del submenú
  private modalInstance: Modal | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  toggleSubMenu(event: Event) {
    event.preventDefault(); // Evita la navegación o comportamiento predeterminado
    this.submenuOpen = !this.submenuOpen; // Alterna el estado del submenú
  }

  onSubMenuClick(event: Event) {
    event.stopPropagation(); // Evita que el submenú se cierre al hacer clic en una opción
  }

  openLogoutModal() {
    const modalElement = document.getElementById('logoutModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  confirmLogout() {
    this.closeModal();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}