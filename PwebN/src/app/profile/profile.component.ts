import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../models/user.model'; // Asegúrate de que la ruta sea correcta
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null; // Inicializa user como null para evitar errores

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getUserProfile().subscribe(
      (data) => {
        this.user = data; // Asigna los datos del usuario
      },
      (error) => {
        console.error('Error al obtener el perfil del usuario', error);
        // Maneja el error como consideres apropiado
      }
    );
  }
}
