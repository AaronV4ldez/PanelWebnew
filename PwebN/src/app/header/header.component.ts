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
  userType: string = '';
  pageTitle: string = '';  // Título de la página actual
  dropdownOpen = false;

  constructor(private authService: AuthService, private router: Router) {
    this.userName = this.authService.getUserName() || 'Usuario';
    this.userType = this.authService.getUserType() || 'TipoUsuario';
  }

  ngOnInit() {
    // Detecta cambios en la ruta para actualizar el título de la página
    this.router.events.subscribe((event) => {
      if (event instanceof ActivatedRoute) {
        console.log('URL actual:', this.router.url); // <-- Agrega esto para ver la URL actual
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
      // Añadir más rutas y títulos según lo que tengas en tu aplicación
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
}
