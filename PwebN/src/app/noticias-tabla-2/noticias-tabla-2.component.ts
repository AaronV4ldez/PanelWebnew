import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service'; // Importamos el servicio de autenticación
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import Quill from 'quill';



@Component({
  selector: 'app-noticias-tabla-2',
  templateUrl: './noticias-tabla-2.component.html',
  styleUrls: ['./noticias-tabla-2.component.css']
})
export class NoticiasTabla2Component {
  titulo: string = '';
  descripcion: string = '';
  imagenNoti: string = '';
  apiUrl: string = 'https://apisprueba.fpfch.gob.mx/api/v1/panel/mkt/news';
  token: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjg2OSwibmFtZSI6IkFhclx1MDBmM24gVmFsZGV6IEdhcmNpYSIsImV4cCI6MTcwNDkwMTM1N30.ORsWQWxVBCjlhItaZ1e63qBIqEL1LFOjKuydoEaDBZg'; // Token proporcionado

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}
  ngAfterViewInit() {
    const quill = new Quill('#editor-container', {
      theme: 'snow',
      placeholder: 'Ingresa la descripción de la noticia...',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'], // Formatos básicos
          ['link', 'image'], // Enlaces e imágenes
          [{ list: 'ordered' }, { list: 'bullet' }], // Listas
          ['clean'] // Limpiar formato
        ]
      }
    });

    // Escuchar cambios en el editor
    quill.on('text-change', () => {
      this.descripcion = quill.root.innerHTML;
    });
  }
  ngOnInit() {
    // Escuchar el evento de cierre del modal
    const successModalElement = document.getElementById('successModal');
    if (successModalElement) {
      successModalElement.addEventListener('hidden.bs.modal', () => {
        this.redirigirANoticias(); // Llamar a la función de redirección
      });
    }
  }

  // Método para manejar el cambio de imagen y mostrar vista previa
onImageChange(event: any) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const imgElement = document.getElementById('vista-previa') as HTMLImageElement;
      imgElement.src = e.target.result;
      imgElement.style.display = 'block'; // Mostrar imagen en vista previa
      this.imagenNoti = e.target.result; // Guardar la imagen como base64
    };

    reader.readAsDataURL(file);
  } else {
    // Si no hay archivo, es posible que quieras manejar el caso de un enlace
    const imageUrl = 'URL_DE_TU_IMAGEN'; // Reemplaza con el enlace real
    const imgElement = document.getElementById('vista-previa') as HTMLImageElement;
    imgElement.src = imageUrl;
    imgElement.style.display = 'block'; // Mostrar imagen en vista previa
    this.imagenNoti = imageUrl; // Guardar el enlace de la imagen
  }
}

  // Método para disparar el input file
  triggerFileInput() {
    const fileInput = document.getElementById('imagen') as HTMLInputElement;
    fileInput.click();
  }

  // Método para mostrar la vista previa
  mostrarVistaPrevia() {
    const modalElement = document.getElementById('previewModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  // Método para confirmar y enviar los datos a la API
  confirmar() {
    const authorId = this.authService.getUserId(); // Obtenemos el ID del usuario logueado
    const accessToken = localStorage.getItem('access_token'); // Obtenemos el token de autenticación
  
    if (!accessToken) {
      console.error('No se encontró el token de autenticación.');
      return;
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`, // Asegurarnos de enviar el token correcto en los headers
      'Content-Type': 'application/json'
    });
  
    const body = {
      author_id: authorId, // ID del usuario
      note_title: this.titulo, // Título de la noticia
      note_content: this.descripcion, // Contenido de la noticia
      note_hyperlink: 'NULL', // Enlace, pero enviamos NULL
      note_media_link: this.imagenNoti, // Enlace de la imagen
      active: 1 // Estado activo
    };
  
    this.http.post(this.apiUrl, body, { headers })
      .subscribe(
        response => {
          console.log('Noticia publicada exitosamente:', response);
          // Mostrar el modal de éxito
          const successModalElement = document.getElementById('successModal');
          if (successModalElement) {
            const successModal = new Modal(successModalElement);
            successModal.show();
          }
        },
        error => {
          console.error('Error publicando la noticia:', error);
          // Aquí puedes manejar el error, como mostrar un mensaje al usuario
        }
      );
  }
  
  
  redirigirANoticias() {
    this.router.navigate(['/noticias']);
  }
  
  
}
