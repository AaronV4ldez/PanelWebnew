import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-transmisiones-en-vivo',
  templateUrl: './transmisiones-en-vivo.component.html',
  styleUrls: ['./transmisiones-en-vivo.component.css']
})
export class TransmisionesEnVivoComponent implements OnInit {

  // Formulario
  publicidadForm: FormGroup;

  // Datos de videos obtenidos de la API
  bridgeLiveCams: any[] = [];

  // Token de autorización
  private token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjg2OSwibmFtZSI6IkFhclx1MDBmM24gVmFsZGV6IEdhcmNpYSIsImV4cCI6MTcwNDkwMTM1N30.ORsWQWxVBCjlhItaZ1e63qBIqEL1LFOjKuydoEaDBZg';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    // Definir el formulario sin la validación de la URL
    this.publicidadForm = this.fb.group({
      nombreVideo: ['', Validators.required],
      url: ['', Validators.required] // Solo se requiere el campo, sin validación de patrón
    });
  }

  ngOnInit(): void {
    this.obtenerVideos();
  }

  // Función para obtener videos desde la API
  obtenerVideos(): void {
    this.http.get('https://apisprueba.fpfch.gob.mx/api/v1/autoconfig/mobile').subscribe((response: any) => {
      this.bridgeLiveCams = response.bridgeLiveCams.map((cam: any) => {
        const iframe = cam.cam_frame;
        const srcMatch = iframe.match(/src="([^"]+)"/);
        const src = srcMatch ? srcMatch[1] : '';
        return {
          cam_title: cam.cam_title,
          cam_frame: src
        };
      });
    });
  }

  // Función para agregar un nuevo video
  // Función para agregar un nuevo video
agregarVideo() {
  if (this.publicidadForm.valid) {
    const { nombreVideo, url } = this.publicidadForm.value;

    // Formato del iframe con la URL del video
    const iframeUrl = `\\u003Ciframe src="${url}" style="border:none; overflow:hidden; width:560px; height:315px" allowfullscreen\\u003E\\u003C/iframe\\u003E`;

    // Construir la URL para la solicitud POST
    const apiUrl = `https://apisprueba.fpfch.gob.mx/api/v1/panel/mkt/livecam/`;
    const body = {
      cam_title: nombreVideo, // Valor del formulario
      cam_frame: iframeUrl // URL con el iframe agregado
    };

    // Agregar el API key en los encabezados
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    // Realizar la solicitud POST
    this.http.post(apiUrl, body, { headers }).subscribe(
      response => {
        console.log('Video agregado exitosamente', response);
        this.cerrarModal(); // Cerrar el modal
        this.obtenerVideos(); // Refrescar la lista de videos
        this.abrirAvisoModal(); // Mostrar el modal de aviso

      },
      error => {
        console.error('Error al agregar el video', error);
        if (error.error) {
          console.error('Detalles del error:', error.error); // Ver detalles del error
        } else {
          console.error('Error desconocido', error); // Manejar otro tipo de error
        }
      }
    );
  } else {
    console.log('El formulario no es válido:', this.publicidadForm.value);
    console.log('Errores del formulario:', this.publicidadForm.errors);
  }
}

  
  // Función para abrir el modal
  abrirModal(): void {
    const modalElement = document.getElementById('agregarVideoModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  abrirAvisoModal(): void {
    const avisoModalElement = document.getElementById('avisoModal');
    if (avisoModalElement) {
      const avisoModalInstance = new bootstrap.Modal(avisoModalElement);
      avisoModalInstance.show();
    }
  }
  // Función para cerrar el modal
  cerrarModal(): void {
    const modalElement = document.getElementById('agregarVideoModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }

  // Función para eliminar video
  eliminarVideo(index: number): void {
    this.bridgeLiveCams.splice(index, 1);
  }

  // Función para editar video
  editarVideo(index: number): void {
    const video = this.bridgeLiveCams[index];
    this.publicidadForm.patchValue({
      nombreVideo: video.cam_title,
      url: video.cam_frame
    });
  }
}
