import { AfterViewInit, Component } from '@angular/core';

declare var bootstrap: any;  // Declaración para usar Bootstrap JS en el componente

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  
  

  ngAfterViewInit(): void {
    // Inicializar y mostrar el modal
    const modalElement = document.getElementById('pruebaModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }
}
