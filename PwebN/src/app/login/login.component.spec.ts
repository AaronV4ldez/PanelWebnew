import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        if (response.usertype === 4) {
          // Procede con el login exitoso
          console.log('Login exitoso', response);
        } else {
          this.errorMessage = 'Solo se permite login de Tramitadores y Admins';
        }
      },
      (error) => {
        this.errorMessage = 'Error al iniciar sesión. Verifique sus credenciales';
      }
    );
  }
}
