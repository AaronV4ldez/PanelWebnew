import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-transmisiones-en-vivo',
  templateUrl: './transmisiones-en-vivo.component.html',
  styleUrls: ['./transmisiones-en-vivo.component.css']
})
export class TransmisionesEnVivoComponent {




  // Formularios para las diferentes secciones
  publicidadForm: FormGroup;
  

  // Datos de videos obtenidos de la API
  bridgeLiveCams: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    
    this.publicidadForm = this.fb.group({
      nombreVideo: [''],
      url: ['']
    });
  }

  ngOnInit(): void {
    this.obtenerVideos();
  }

  // Función para obtener videos desde la API
  obtenerVideos(): void {
    this.http.get('https://apisprueba.fpfch.gob.mx/api/v1/autoconfig/mobile').subscribe((response: any) => {
      this.bridgeLiveCams = response.bridgeLiveCams.map((cam: any) => {
        // Extraemos el src del iframe usando una expresión regular
        const iframe = cam.cam_frame;
        const srcMatch = iframe.match(/src="([^"]+)"/);
        const src = srcMatch ? srcMatch[1] : '';

        return {
          cam_title: cam.cam_title,
          cam_frame: src // Guardamos solo el src extraído
        };
      });
    });
  }

  // Función para agregar nuevo video
  agregarVideo(): void {
    const nuevoVideo = this.publicidadForm.value;
    this.bridgeLiveCams.push(nuevoVideo);
    this.publicidadForm.reset();
  }

  // Función para editar video existente
  editarVideo(index: number): void {
    const video = this.bridgeLiveCams[index];
    this.publicidadForm.patchValue({
      nombreVideo: video.cam_title,
      url: video.cam_frame
    });
  }

  // Función para eliminar video
  eliminarVideo(index: number): void {
    this.bridgeLiveCams.splice(index, 1);
  }
}