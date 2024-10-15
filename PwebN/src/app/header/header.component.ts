import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userName: string = '';
  userType: string = '';  // Cambia esto a string para ser consistente
  pageTitle: string = '';  
  dropdownOpen = false;

  constructor(private authService: AuthService, private router: Router) {
    this.userName = this.authService.getUserName() || 'Usuario';
    const utValue = this.authService.getUserType();  // Obtener el valor de ut
    this.userType = this.getUserTypeText(utValue);  // Obtener el texto basado en ut
  }

  ngOnInit() {
    // Detecta cambios en la ruta para actualizar el título de la página
    this.router.events.subscribe((event) => {
      if (event instanceof ActivatedRoute) {
        this.setPageTitle(this.router.url);
      }
    });
  }

  setPageTitle(url: string) {
    switch (url) {
      case '/dashboard':
        this.pageTitle = 'Dashboard';
        break;
      case '/profile':
        this.pageTitle = 'Perfil de Usuario';
        break;
      default:
        this.pageTitle = 'Página Desconocida';
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    this.authService.logout();
  }

  getUserTypeText(ut: string | null): string {
    if (!ut) return 'TipoUsuario';  // Valor por defecto si ut es null

    switch (ut) {
      case '1':
        return 'Administrador';
      case '2':
        return 'Tramitador';
      case '3':
        return 'Administrador';
      case '4':
        return 'Super Admin';
      case '5':
        return 'Comunicación Social';
      case '6':
          return 'Testing'
      default:
        return 'Tipo Desconocido';
    }
  }
}
