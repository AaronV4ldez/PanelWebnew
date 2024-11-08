import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chart, ChartConfiguration } from 'chart.js';

declare var bootstrap: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('assignedChart') assignedChartRef!: ElementRef;
  @ViewChild('categoryChart') categoryChartRef!: ElementRef;

  webUserCount: number = 0;
  appUserCount: number = 0;
  startDate: string = '';
  endDate: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getWebUsersCount();
    this.getAppUsersCount();
  }

  ngAfterViewInit(): void {
    const modalElement = document.getElementById('pruebaModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }

    this.initCharts();
  }

  getWebUsersCount() {
    const url = 'https://apisprueba.fpfch.gob.mx/api/v1/panel/users/web-users';
    const headers = new HttpHeaders({
      'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjg2OSwibmFtZSI6IkFhclx1MDBmM24gVmFsZGV6IEdhcmNpYSIsImV4cCI6MTcwNDkwMTM1N30.ORsWQWxVBCjlhItaZ1e63qBIqEL1LFOjKuydoEaDBZg`
    });

    this.http.get<any[]>(url, { headers }).subscribe(
      (data) => {
        this.webUserCount = data.length;
      },
      (error) => {
        console.error('Error al obtener usuarios web:', error);
      }
    );
  }

  getAppUsersCount() {
    const url = 'https://apisprueba.fpfch.gob.mx/api/v1/panel/users/mobile-users';
    const headers = new HttpHeaders({
      'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjg2OSwibmFtZSI6IkFhclx1MDBmM24gVmFsZGV6IEdhcmNpYSIsImV4cCI6MTcwNDkwMTM1N30.ORsWQWxVBCjlhItaZ1e63qBIqEL1LFOjKuydoEaDBZg`
    });

    this.http.get<any[]>(url, { headers }).subscribe(
      (data) => {
        this.appUserCount = data.length;
      },
      (error) => {
        console.error('Error al obtener usuarios app:', error);
      }
    );
  }

  initCharts() {
    // Gráfico de trámites asignados
    const assignedChartCtx = this.assignedChartRef.nativeElement.getContext('2d');
    new Chart(assignedChartCtx, {
      type: 'line',
      data: {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [
          { label: 'Asignados', backgroundColor: '#FF4081', data: [500, 700, 400, 300, 200, 100, 300] },
          { label: 'Completados', backgroundColor: '#8E24AA', data: [300, 500, 200, 400, 100, 200, 300] }
        ]
      }
    });

    // Gráfico de categoría de trámites
    const categoryChartCtx = this.categoryChartRef.nativeElement.getContext('2d');
    new Chart(categoryChartCtx, {
      type: 'bar',
      data: {
        labels: ['Cambio Vehículo', 'Cambio TAG', 'Cambio Puente', 'Cambio Nombre', 'Act. Seguro', 'Act. Placas'],
        datasets: [
          { label: 'Cantidad', backgroundColor: '#1976D2', data: [200, 600, 100, 400, 500, 300] }
        ]
      }
    });
  }
}