import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_LOGIN_URL = 'https://apisprueba.fpfch.gob.mx/api/v1/account/login';
  private API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjg2OSwibmFtZSI6IkFhclx1MDBmM24gVmFsZGV6IEdhcmNpYSIsImV4cCI6MTcwNDkwMTM1N30.ORsWQWxVBCjlhItaZ1e63qBIqEL1LFOjKuydoEaDBZg';

  constructor(private http: HttpClient) {}

  login(userLogin: string, userPassword: string): Observable<any> {
    const body = { userlogin: userLogin, password: userPassword };

    // Añadir la API Key en los headers
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.API_KEY}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(this.API_LOGIN_URL, body, { headers }).pipe(
      // Procesar la respuesta
      tap(response => {
        console.log('Respuesta de la API de login:', response); // Verificamos toda la respuesta

        // Guarda el token, nombre, ut y id en el localStorage
        this.setApiKey(response.access_token);
        this.setUserName(response.name);
        this.setUserType(response.ut.toString());
        this.setUserId(response.id.toString());  // Almacenar el ID del usuario correctamente
      })
    );
  }

  setApiKey(token: string) {
    localStorage.setItem('access_token', token);
  }

  setUserName(name: string) {
    localStorage.setItem('user_name', name); // Guarda el nombre del usuario
  }

  setUserId(uID: string) {
    console.log('Guardando el ID del usuario:', uID); // Confirmar que el ID se está guardando
    localStorage.setItem('id', uID);
  }

  setUserType(ut: string) {
    localStorage.setItem('user_type', ut); // Guarda el ut
  }

  getUserId(): number {
    const userId = localStorage.getItem('id');
    console.log('User ID desde localStorage:', userId); // Verificar si el ID está guardado correctamente
    return userId ? parseInt(userId, 10) : 0; // Devuelve 0 si el ID no está presente
  }
  

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_name'); // Remueve también el nombre del usuario al cerrar sesión
    localStorage.removeItem('id'); // Remover el ID del usuario
  }

  getUserName(): string | null {
    return localStorage.getItem('user_name'); // Obtén el nombre del usuario desde el localStorage
  }

  getUserType(): string | null {
    return localStorage.getItem('user_type'); // Obtén el nombre del usuario desde el localStorage
  }

  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return of(null);  // Si no hay token, retorna null o algún mensaje
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<any>('https://apisprueba.fpfch.gob.mx/api/v1/account/login', { headers });
  }
}
