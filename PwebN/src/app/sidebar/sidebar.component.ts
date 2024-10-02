import { Component } from '@angular/core';
import { AuthService } from '../auth.service';  // Asegúrate de que la ruta sea correcta
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout(); // Implementa este método en tu servicio de autenticación
    this.router.navigate(['/login']); // Redirige a la página de login
  }
}
