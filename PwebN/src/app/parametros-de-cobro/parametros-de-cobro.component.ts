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
      this.bridgesConfig = data.bridgesConfig.map((bridge: any) => {
        // Realiza el split en prepay_amounts y filtra valores no numéricos o "0"
        bridge.prepayOptions = bridge.prepay_amounts
          .split(',')
          .filter((amount: string) => amount !== "0");

        return bridge;
      });

      // Configura el valor mínimo de prepay
      this.prepayMinimumAmount = data.globalConfig.prepay_minimum_amount;
    });
  }
}
