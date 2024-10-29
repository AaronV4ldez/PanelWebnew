// src/app/parametros-de-cobro/parametros-de-cobro.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-parametros-de-cobro',
  templateUrl: './parametros-de-cobro.component.html',
  styleUrls: ['./parametros-de-cobro.component.css']
})
export class ParametrosDeCobroComponent implements OnInit {

  bridgesConfig: any[] = [];
  prepayMinimumAmount: number = 0;

  // URL de la API
  private apiUrl = 'https://apisprueba.fpfch.gob.mx/api/v1/autoconfig/mobile';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Realiza la solicitud a la API
    this.http.get<any>(this.apiUrl).subscribe(data => {
      // Almacena los datos recibidos de la API
      this.bridgesConfig = data.bridgesConfig; // Datos de los puentes
      this.prepayMinimumAmount = data.globalConfig.prepay_minimum_amount; // Pago mínimo
    });
  }
}
