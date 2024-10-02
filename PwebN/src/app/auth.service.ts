import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './models/user.model'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_LOGIN_URL = 'https://apisprueba.fpfch.gob.mx/api/v1/session/login';
  private API_USER_PROFILE_URL = 'https://apisprueba.fpfch.gob.mx/api/v1/user/profile'; // URL de perfil de usuario
  private API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjg2OSwibmFtZSI6IkFhclx1MDBmM24gVmFsZGV6IEdhcmNpYSIsImV4cCI6MTcwNDkwMTM1N30.ORsWQWxVBCjlhItaZ1e63qBIqEL1LFOjKuydoEaDBZg';

  constructor(private http: HttpClient) {}

  login(userLogin: string, userPassword: string): Observable<any> {
    const body = { userlogin: userLogin, password: userPassword };

    // Añadir la API Key en los headers
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.API_KEY}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.API_LOGIN_URL, body, { headers });
  }

  setApiKey(token: string) {
    localStorage.setItem('access_token', token);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  logout() {
    localStorage.removeItem('access_token'); // Asegúrate de usar el nombre correcto
  }  

  getUserProfile(): Observable<User> {
    const token = localStorage.getItem('access_token'); // Usa el token correcto
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Asegúrate de que estás enviando el token correcto
    });

    return this.http.get<User>(this.API_USER_PROFILE_URL, { headers }); // Cambia a la URL correcta para el perfil
  }
}
