import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as bootstrap from 'bootstrap';

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
  
  private successModal: bootstrap.Modal | null = null; // Referencia al modal de éxito
  private requestsCompleted: number = 0; // Contador de solicitudes completadas

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerConfiguracion();
  }

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

  agregarMonto(bridge: any) {
    if (bridge.nuevoMonto && bridge.nuevoMonto > 0) {
      bridge.prepayOptions.push(bridge.nuevoMonto.toString());
      bridge.nuevoMonto = ''; // Limpiar el campo después de agregar
    }
  }

  eliminarMonto(bridge: any, index: number) {
    bridge.prepayOptions.splice(index, 1);
  }

  guardarInformacion() {
    this.requestsCompleted = 0; // Reiniciar el contador cada vez que se guarda la información

    this.bridgesConfig.forEach((bridge, index, array) => {
      const prepayAmountsValue = bridge.prepayOptions.length > 0 
        ? bridge.prepayOptions.join(',') // Si hay valores, los une con comas
        : "0"; // Si está vacío, usa "0"

      const payload = {
        entry_id: bridge.entry_id,
        bridge_name: bridge.bridge_name,
        annual_fee_mx: bridge.annual_fee_mx,
        annual_renew_fee_mx: bridge.annual_renew_fee_mx,
        annual_fee_us: 0,
        annual_renew_fee_us: 0,
        prepay_amounts: prepayAmountsValue, // Asigna el valor procesado aquí
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
          
          // Incrementar el contador de solicitudes completadas
          this.requestsCompleted++;
          
          // Verificar si esta es la última solicitud
          if (this.requestsCompleted === array.length) {
            this.mostrarModalExito(); // Mostrar el modal solo después de la última solicitud
          }
        });
    });
  }

  // Método para mostrar el modal de éxito
  mostrarModalExito() {
    const modalElement = document.getElementById('successModal');
    if (modalElement) {
      this.successModal = new bootstrap.Modal(modalElement);
      this.successModal.show();
    }
  }

  // Método para cerrar el modal de éxito
  cerrarModalExito() {
    if (this.successModal) {
      this.successModal.hide();
    }
  }

  private handleError(error: any) {
    console.error('Error en la solicitud:', error);
    return throwError(() => error);
  }
}