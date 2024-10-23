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

  // ID del video seleccionado para eliminación
  selectedVideoId: number | null = null;

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

        // Devolvemos todos los valores, incluyendo entry_id
        return {
          cam_title: cam.cam_title,
          cam_frame: src,  // Extraemos el src del iframe
          entry_id: cam.entry_id  // Guardamos el entry_id
        };
      });
    });
  }

  // Función para agregar un nuevo video
  agregarVideo(): void {
    if (this.publicidadForm.valid) {
      const { nombreVideo, url } = this.publicidadForm.value;

      // Formato del iframe con la URL del video
      const iframeUrl = `<iframe src="${url}" style="border:none; overflow:hidden; width:560px; height:315px" allowfullscreen></iframe>`;

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
        }
      );
    } else {
      console.log('El formulario no es válido:', this.publicidadForm.value);
    }
  }

  // Función para eliminar video usando el entry_id almacenado
  eliminarVideo(): void {
    if (this.selectedVideoId !== null) {
      const apiUrl = `https://apisprueba.fpfch.gob.mx/api/v1/panel/mkt/livecam/${this.selectedVideoId}`;

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      });

      this.http.delete(apiUrl, { headers }).subscribe(
        response => {
          console.log('Video eliminado exitosamente', response);
          this.obtenerVideos(); // Refrescar la lista de videos
          this.selectedVideoId = null; // Reiniciar el ID seleccionado
          this.abrirAvisoModal(); // Mostrar el modal de aviso
        },
        error => {
          console.error('Error al eliminar el video', error);
        }
      );
    }
  }

  // Función para abrir el modal de agregar video
  abrirModal(): void {
    const modalElement = document.getElementById('agregarVideoModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Función para cerrar el modal de agregar video
  cerrarModal(): void {
    const modalElement = document.getElementById('agregarVideoModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

  // Función para abrir el modal de aviso
  abrirAvisoModal(): void {
    const avisoModalElement = document.getElementById('avisoModal');
    if (avisoModalElement) {
      const avisoModal = new bootstrap.Modal(avisoModalElement);
      avisoModal.show();
    }
  }

  // Función para abrir el modal de confirmación de eliminación
  confirmarEliminar(index: number): void {
    const video = this.bridgeLiveCams[index];
    this.selectedVideoId = video.entry_id;  // Guardar el ID del video seleccionado para eliminación
    const eliminarModalElement = document.getElementById('eliminarModal');
    if (eliminarModalElement) {
      const eliminarModalInstance = new bootstrap.Modal(eliminarModalElement);
      eliminarModalInstance.show();  // Mostrar el modal de confirmación
    }
  }

  // Función para editar un video (pendiente de implementación)
  editarVideo(index: number): void {
    // Lógica para editar un video
    console.log('Editar video con índice:', index);
  }
}
