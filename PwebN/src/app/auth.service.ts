import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_LOGIN_URL = 'https://apisprueba.fpfch.gob.mx/api/v1/session/login';
  private API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjg2OSwibmFtZSI6IkFhclx1MDBmM24gVmFsZGV6IEdhcmNpYSIsImV4cCI6MTcwNDkwMTM1N30.ORsWQWxVBCjlhItaZ1e63qBIqEL1LFOjKuydoEaDBZg';

  constructor(private http: HttpClient) {}

  login(userLogin: string, userPassword: string): Observable<any> {
    const body = { userlogin: userLogin, password: userPassword };

    // Añadir la API Key en los headers
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.API_KEY}`,
      'Content-Type': 'application/json',
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
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_name'); // Remueve también el nombre del usuario al cerrar sesión
  }

  setUserName(name: string) {
    localStorage.setItem('user_name', name); // Guarda el nombre del usuario
  }
  setUserType(ut: string) {
    localStorage.setItem('user_type', ut); // Guarda el nombre del usuario
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
  
    return this.http.get<any>('httpshttps://apisprueba.fpfch.gob.mx/api/v1/session/loginfpfc.gob.mx/', { headers });
  }
  
}
