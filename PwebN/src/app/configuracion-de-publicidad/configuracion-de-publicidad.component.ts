import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-configuracion-de-publicidad',
  templateUrl: './configuracion-de-publicidad.component.html',
  styleUrls: ['./configuracion-de-publicidad.component.css']
})
export class ConfiguracionDePublicidadComponent implements OnInit {

  // Formularios para las diferentes secciones
  parametrosCobroMXForm: FormGroup;
  parametrosCobroUSForm: FormGroup;
  parametrosTelepeajeForm: FormGroup;
  horariosAtencionForm: FormGroup;
  parametrosMensajeriaForm: FormGroup;
  publicidadForm: FormGroup;
  

  // Datos de videos obtenidos de la API
  bridgeLiveCams: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    // Inicializamos los formularios
    this.parametrosCobroMXForm = this.fb.group({
      anualidadZaragozaTotal: [''],
      anualidadLerdoTotal: [''],
      anualidadMixtoTotal: [''],
      saldoZaragoza1Total: [''],
      saldoZaragoza2Total: [''],
      anualidadZaragozaNeto: [''],
      anualidadLerdoNeto: [''],
      anualidadMixtoNeto: [''],
      saldoZaragoza1Neto: [''],
      saldoZaragoza2Neto: ['']
    });

    this.parametrosCobroUSForm = this.fb.group({
      anualidadZaragozaTotalUS: [''],
      anualidadLerdoTotalUS: [''],
      anualidadMixtoTotalUS: [''],
      saldoZaragoza1TotalUS: [''],
      saldoZaragoza2TotalUS: [''],
      anualidadZaragozaNetoUS: [''],
      anualidadLerdoNetoUS: [''],
      anualidadMixtoNetoUS: [''],
      saldoZaragoza1NetoUS: [''],
      saldoZaragoza2NetoUS: ['']
    });

    this.parametrosTelepeajeForm = this.fb.group({
      pagoMinimo: ['']
    });

    this.horariosAtencionForm = this.fb.group({
      horarioInicio: ['08:00 a.m.'],
      horarioFin: ['08:00 p.m.']
    });

    this.parametrosMensajeriaForm = this.fb.group({
      llaveWhatsapp: ['']
    });

    this.publicidadForm = this.fb.group({
      nombreVideo: [''],
      url: ['']
    });
  }

  ngOnInit(): void {
    this.obtenerParametros();
    this.obtenerVideos();
  }

  // Función para obtener parámetros desde la API
  obtenerParametros(): void {
    this.http.get('https://apisprueba.fpfch.gob.mx/api/v1/autoconfig/mobile').subscribe((response: any) => {
      
      // Extraer el valor de prepay_minimum_amount desde globalconfig
      const prepayMinimum = response.globalconfig.prepay_minimum_amount;
      this.parametrosTelepeajeForm.patchValue({
        pagoMinimo: prepayMinimum
      });

      // Extraer los valores de bridgeRates para cada entry_id
      const bridgeRates = response.bridgeRates;

      // Zaragoza (entry_id = 1)
      const zaragoza = bridgeRates.find((rate: any) => rate.entry_id === 1);
      if (zaragoza) {
        this.parametrosCobroMXForm.patchValue({
          anualidadZaragozaTotal: zaragoza.annual_fee_mx,
          saldoZaragoza1Total: zaragoza.balance1_mx,
          saldoZaragoza2Total: zaragoza.balance2_mx
        });
        this.parametrosCobroUSForm.patchValue({
          anualidadZaragozaTotalUS: zaragoza.annual_fee_us,
          saldoZaragoza1TotalUS: zaragoza.balance1_us,
          saldoZaragoza2TotalUS: zaragoza.balance2_us
        });
      }

      // Lerdo (entry_id = 2)
      const lerdo = bridgeRates.find((rate: any) => rate.entry_id === 2);
      if (lerdo) {
        this.parametrosCobroMXForm.patchValue({
          anualidadLerdoTotal: lerdo.annual_fee_mx
        });
        this.parametrosCobroUSForm.patchValue({
          anualidadLerdoTotalUS: lerdo.annual_fee_us
        });
      }

      // Mixto (entry_id = 3)
      const mixto = bridgeRates.find((rate: any) => rate.entry_id === 3);
      if (mixto) {
        this.parametrosCobroMXForm.patchValue({
          anualidadMixtoTotal: mixto.annual_fee_mx
        });
        this.parametrosCobroUSForm.patchValue({
          anualidadMixtoTotalUS: mixto.annual_fee_us
        });
      }
    });
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