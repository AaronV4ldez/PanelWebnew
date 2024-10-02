import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userLogin: string = ''; 
  userPassword: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  loginRequest() {
    if (this.userLogin === '' || this.userPassword === '') {
      this.errorMessage = 'Debe proporcionar usuario y contraseña para iniciar sesión.';
      return;
    }

    this.authService.login(this.userLogin, this.userPassword).subscribe(
      (response) => {
        if (!response.access_token) {
          this.errorMessage = response.message || 'Error en inicio de sesión.';
          return;
        }

        if (response.ut < 2) {
          this.errorMessage = 'Solo se permite login de Tramitadores y Admins.';
          return;
        }

        // Guardar el token del usuario
        this.authService.setApiKey(response.access_token);

        // Redirigir al dashboard
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        this.errorMessage = error.error.message || 'Error en inicio de sesión.';
      }
    );
  }
  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']); // Redirige si ya está autenticado
    }
  }
  
}
