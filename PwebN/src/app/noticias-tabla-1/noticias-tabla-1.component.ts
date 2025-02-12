import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import * as bootstrap from 'bootstrap';
import Quill from 'quill';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-noticias-tabla-1',
  templateUrl: './noticias-tabla-1.component.html',
  styleUrls: ['./noticias-tabla-1.component.css'],
})
export class NoticiasTabla1Component implements OnInit {
  noticias: any[] = [];
  //noticiaSeleccionada: any = null;
  noticiaAEliminar: any = null;
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 8;
  descripcion: string = ''; // Para almacenar la descripción en HTML
  quillEditor!: Quill;
  noticiaSeleccionada: any = {
    note_title: '',
    created_at: '',
    note_content: '',
    note_hyperlink: '',
  };
  private apiUrl: string = 'https://apisprueba.fpfch.gob.mx/api/v1/panel/mkt/news';
  private token: string = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjg2OSwibmFtZSI6IkFhclx1MDBmM24gVmFsZGV6IEdhcmNpYSIsImV4cCI6MTcwNDkwMTM1N30.ORsWQWxVBCjlhItaZ1e63qBIqEL1LFOjKuydoEaDBZg';

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Inicializando componente...');
    this.cargarNoticias(); // Llamamos cargarNoticias al iniciar el componente
  }

  cargarNoticias(): void {
    const headers = new HttpHeaders({ Authorization: this.token });
    this.http.get<any[]>('https://apisprueba.fpfch.gob.mx/api/v1/mkt/news', { headers }).subscribe(
      (response) => {
        console.log('Noticias cargadas:', response);
        this.noticias = response;
        this.cdr.detectChanges(); // Forzar detección de cambios
      },
      (error) => console.error('Error al cargar noticias:', error)
    );
  }

  get filteredNoticias() {
    return this.noticias.filter(
      (noticia) =>
        noticia.note_title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        noticia.created_at.includes(this.searchTerm)
    );
  }

  abrirEditarModal(noticia: any): void {
    this.noticiaSeleccionada = { ...noticia }; // Clonamos la noticia
    this.descripcion = noticia.note_content; // Cargamos la descripción
  
    const modalElement = document.getElementById('editarNoticiaModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
  
      // Si ya existe un editor Quill, reutilízalo
      const quillContainer = document.getElementById('editor-container');
      if (quillContainer && !this.quillEditor) {
        this.quillEditor = new Quill('#editor-container', {
          theme: 'snow',
          placeholder: 'Ingresa la descripción...',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline'],
              ['link', 'image'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['clean'],
            ],
          },
        });
  
        // Escucha los cambios del editor
        this.quillEditor.on('text-change', () => {
          this.descripcion = this.quillEditor.root.innerHTML;
        });
      }
  
      // Sincroniza el contenido con el editor
      if (this.quillEditor) {
        this.quillEditor.root.innerHTML = this.descripcion;
      }
    }
  }

  guardarNoticia(): void {
    if (!this.noticiaSeleccionada) {
      console.error('No hay noticia seleccionada.');
      return;
    }
  
    const accessToken = localStorage.getItem('access_token'); // Obtenemos el token de autenticación
  
    if (!accessToken) {
      console.error('No se encontró el token de autenticación.');
      alert('Usuario no autenticado. Inicia sesión nuevamente.');
      return;
    }
  
    const authorId = this.getUserId(); // Obtenemos el ID del usuario logueado
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`, // Usamos el token desde localStorage
      'Content-Type': 'application/json',
    });
  
    const body = {
      entry_id: this.noticiaSeleccionada.entry_id, // ID de la noticia
      note_content: this.descripcion, // Contenido actualizado
      note_hyperlink: this.noticiaSeleccionada.note_hyperlink || 'NULL', // Enlace o valor por defecto
      note_media_link: this.noticiaSeleccionada.note_media_link, // Enlace a la imagen
      note_title: this.noticiaSeleccionada.note_title, // Título de la noticia
      active: 1, // Estado activo
      author_id: authorId, // ID del autor
    };
  
    console.log('Enviando body:', body);
  
    // Realizamos la solicitud POST al URL correcto
    this.http.post('https://apisprueba.fpfch.gob.mx/api/v1/panel/mkt/news', body, { headers })
      .subscribe(
        (response) => {
          console.log('Noticia actualizada exitosamente:', response);
  
          // Cerramos el modal de edición
          const modalElement = document.getElementById('editarNoticiaModal');
          if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal?.hide();
          }
  
          // Recargar la lista de noticias desde el servidor
          setTimeout(() => {
            this.cargarNoticias();
          }, 300); // Pequeño retraso para evitar conflictos con la actualización visual
  
          alert('Noticia actualizada correctamente.');
        },
        (error) => {
          console.error('Error al actualizar la noticia:', error);
  
          if (error.status === 401) {
            alert('Error 401: Usuario no autenticado. Por favor, inicia sesión.');
          } else {
            alert('Hubo un error al actualizar la noticia.');
          }
        }
      );
  }
  
  getUserId(): number {
    // Simulación de obtención de user ID del token (decodificar el token o cualquier otra lógica)
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No se encontró el token.');
      return 0;
    }
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar el payload del token JWT
      return payload.sub; // Aquí asumimos que el ID del usuario está en el campo "sub"
    } catch (error) {
      console.error('Error decodificando el token:', error);
      return 0;
    }
  }

  abrirModal(noticia: any): void {
    this.noticiaSeleccionada = noticia; // Selecciona la noticia
    const modalElement = document.getElementById('noticiaModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  
    // Ajustar imágenes dinámicas en el contenido
    setTimeout(() => {
      const images = document.querySelectorAll('.description-content img');
      images.forEach((img: any) => {
        img.style.maxWidth = '100%';
        img.style.maxHeight = '70vh';
        img.style.objectFit = 'contain';
        img.style.display = 'block';
        img.style.margin = '0 auto';
      });
    }, 100);
  }

  confirmarEliminar(noticia: any): void {
    this.noticiaAEliminar = noticia;
    const modalElement = document.getElementById('confirmarEliminarModal');
    if (modalElement) new bootstrap.Modal(modalElement).show();
  }

  eliminarNoticia(): void {
    const url = `https://apisprueba.fpfch.gob.mx/api/v1/panel/mkt/news/${this.noticiaAEliminar.entry_id}`;
    const headers = new HttpHeaders({ Authorization: this.token });

    this.http.delete(url, { headers }).subscribe(
      () => {
        this.noticias = this.noticias.filter((n) => n.entry_id !== this.noticiaAEliminar.entry_id);
        this.cargarNoticias();

        const confirmarEliminarModalElement = document.getElementById('confirmarEliminarModal');
        if (confirmarEliminarModalElement) {
          const confirmarEliminarModalInstance = bootstrap.Modal.getInstance(confirmarEliminarModalElement);
          confirmarEliminarModalInstance?.hide();
        }

        alert('Noticia eliminada correctamente.');
      },
      (error) => console.error('Error al eliminar la noticia', error)
    );
  }

  exportarNoticias(): void {
    const nombreArchivo = prompt("Ingrese el nombre del archivo:", "noticias");
  
    if (nombreArchivo) {
      const datos = this.noticias.map((n) => ({
        Título: n.note_title,
        'Fecha de Alta': n.created_at,
        'Descripción': n.note_content,
        'Enlace Externo': n.note_hyperlink,
        'Enlace Imagen': n.note_media_link,
        'Autor': n.author_id,
      }));
      const hoja = XLSX.utils.json_to_sheet(datos);
      const libro = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(libro, hoja, 'Noticias');
  
      const archivo = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([archivo], { type: 'application/octet-stream' }), `${nombreArchivo}.xlsx`);
    } else {
      console.log("Exportación cancelada");
    }
  }

  safeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  adjustImagesInDescription(): void {
    const modalBody = document.querySelector('.description-content');
    if (modalBody) {
      const images = modalBody.querySelectorAll('img');
      images.forEach((img: HTMLImageElement) => {
        img.style.maxWidth = '100%';
        img.style.maxHeight = '70vh';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '0 auto';
        img.style.objectFit = 'contain';
      });
    }
  }

  
}