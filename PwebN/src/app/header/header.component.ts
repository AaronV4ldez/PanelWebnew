import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userName: string = '';
  userType: string = '';
  pageTitle: string = '';
  isDropdownOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Configuración inicial del usuario
    this.userName = this.authService.getUserName() || 'Usuario';
    this.userType = this.getUserTypeText(this.authService.getUserType());

    // Detectar cambios en la URL para actualizar el título dinámico
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updatePageTitle();
      }
    });

    // Actualiza el título inicial
    this.updatePageTitle();
  }

  // Actualiza el título según la ruta activa
  updatePageTitle(): void {
    let currentRoute = this.activatedRoute.root;

    // Navega a través de las rutas secundarias para encontrar la activa
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    const routePath = currentRoute.snapshot.routeConfig?.path;
    const titles: { [key: string]: string } = {
      dashboard: 'Inicio',
      tramites: 'Trámites',
      noticias: 'Noticias',
      'configuracion-de-publicidad': 'Configuración de Publicidad',
      'usuarios-de-panel-web': 'Usuarios de Panel Web',
      'usuarios-de-app-movil': 'Usuarios de App Móvil',
      reports: 'Reportes',
      'reports/details': 'Detalles del Reporte',
      profile: 'Perfil de Usuario'
    };

    this.pageTitle = titles[routePath || ''] || 'Página Desconocida';
  }

  // Manejo del menú desplegable
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Cerrar sesión
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Devuelve el texto correspondiente al tipo de usuario
  getUserTypeText(ut: string | null): string {
    if (!ut) return 'TipoUsuario';  // Valor por defecto si ut es null

    const userTypes: { [key: string]: string } = {
      '1': 'Administrador',
      '2': 'Tramitador',
      '3': 'Administrador',
      '4': 'Super Admin',
      '5': 'Comunicación Social',
      '6': 'Testing'
    };
    return userTypes[ut] || 'Tipo Desconocido';
  }
}