import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-parametros-de-cobro',
  templateUrl: './parametros-de-cobro.component.html',
  styleUrls: ['./parametros-de-cobro.component.css']
})
export class ParametrosDeCobroComponent implements OnInit {

  bridgesConfig: any[] = [];
  prepayMinimumAmount: number = 0;
  private apiUrl = 'https://apisprueba.fpfch.gob.mx/api/v1/autoconfig/mobile';
  private updateApiUrl = 'https://apisprueba.fpfch.gob.mx/api/v1/panel/config/publish/bridge-rate';
  private token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjg2OSwibmFtZSI6IkFhclx1MDBmM24gVmFsZGV6IFRlc3QiLCJleHAiOjE3Mjk3ODc3NjN9.T9xaWtCBSbaBC8dHBjT5_oUCIBDWSnZknSiibAgMDgQ';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerConfiguracion();
  }

  // Obtener configuración inicial de la API
  obtenerConfiguracion() {
    this.http.get<any>(this.apiUrl).pipe(
      catchError(this.handleError)
    ).subscribe(data => {
      this.bridgesConfig = data.bridgesConfig.map((bridge: any) => {
        bridge.prepayOptions = bridge.prepay_amounts
          .split(',')
          .filter((amount: string) => amount !== "0");
        return bridge;
      });
      this.prepayMinimumAmount = data.globalConfig.prepay_minimum_amount;
    });
  }

  // Función para enviar la configuración actualizada a la API
  guardarInformacion() {
    this.bridgesConfig.forEach(bridge => {
      const payload = {
        entry_id: bridge.entry_id,  // Asegúrate de que `entry_id` esté en la configuración inicial
        bridge_name: bridge.bridge_name,
        annual_fee_mx: bridge.annual_fee_mx,
        annual_renew_fee_mx: bridge.annual_renew_fee_mx,
        annual_fee_us: 0,
        annual_renew_fee_us: 0,
        prepay_amounts: bridge.prepayOptions.join(','),  // Convierte las opciones de prepago en una cadena
        is_billable: bridge.is_billable || 0,
        has_cams: bridge.has_cams || 1
      };

      const headers = new HttpHeaders({
        'Authorization': this.token,
        'Content-Type': 'application/json'
      });

      this.http.post(this.updateApiUrl, payload, { headers })
        .pipe(catchError(this.handleError))
        .subscribe(response => {
          console.log(`Información guardada para el puente: ${bridge.bridge_name}`, response);
        });
    });
  }

  // Manejo de errores
  private handleError(error: any) {
    console.error('Error en la solicitud:', error);
    return throwError(() => error);
  }
}