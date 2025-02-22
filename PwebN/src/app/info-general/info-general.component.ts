import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
declare var bootstrap: any;
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import Quill from 'quill';

@Component({
  selector: 'app-info-general',
  templateUrl: './info-general.component.html',
  styleUrls: ['./info-general.component.css']
})
export class InfoGeneralComponent implements OnInit, AfterViewInit {
  docs: any[] = [];
  filteredDocs: any[] = [];
  searchText: string = '';
  isLoading: boolean = false;
  selectedDocument: any = {}; 
  quillEditor: Quill | null = null;
  editModalInstance: any = null; 

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  sanitizeContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  ngOnInit(): void {
    this.fetchData();
  }

  ngAfterViewInit(): void {
    const modal = document.getElementById('editarDocumentoModal');
    if (modal) {
      modal.addEventListener('shown.bs.modal', () => {
        this.initQuill();
      });

      modal.addEventListener('hidden.bs.modal', () => {
        this.resetModal();
      });
    }
  }

  fetchData(): void {
    this.isLoading = true;
    this.http.get('https://lexpresapp.fpfch.gob.mx/api/v1/autoconfig/mobile')
      .subscribe((response: any) => {
        this.docs = response.appDocs;
        this.filteredDocs = this.docs;
        this.isLoading = false;
      }, error => {
        console.error('Error al obtener los datos', error);
        this.isLoading = false;
      });
  }

  search(): void {
    this.filteredDocs = this.docs.filter(doc =>
      doc.doc_title.toLowerCase().includes(this.searchText.toLowerCase()) ||
      doc.doc_content.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  viewDocument(doc: any): void {
    if (!doc) return; 

    this.selectedDocument = doc;
    setTimeout(() => {
      const modalElement = document.getElementById('documentoModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    }, 0);
  }

  editDocument(doc: any): void {
    this.selectedDocument = { ...doc }; // Clonamos el objeto para evitar modificar el original.
  
    // **🛑 Antes de inicializar Quill, destruimos cualquier instancia previa**
    this.destroyQuill();
  
    setTimeout(() => {
      this.initQuill();
    }, 300); // Pequeño delay para asegurar que el DOM está listo.
  
    const modalElement = document.getElementById('editarDocumentoModal');
    if (modalElement) {
      this.editModalInstance = new bootstrap.Modal(modalElement);
      this.editModalInstance.show();
    }
  }
  
  initQuill(): void {
    const quillContainer = document.getElementById('editor-container');

    // **🛑 Evitar inicialización si Quill ya existe**
    if (this.quillEditor) {
      console.warn('⚠️ Quill ya está inicializado, se evitará la duplicación.');
      return;
    }

    if (!quillContainer) {
      console.error('❌ No se encontró el contenedor de Quill.');
      return;
    }

    // **🔥 Limpiar el contenedor antes de inicializar Quill**
    quillContainer.innerHTML = '';

    // **✅ Inicializar Quill correctamente**
    this.quillEditor = new Quill('#editor-container', {
      theme: 'snow',
      placeholder: 'Escribe aquí...',
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['link', 'blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ direction: 'rtl' }],
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
          ['clean']
        ]
      }
    });

    // **📌 Cargar contenido en Quill si existe**
    if (this.selectedDocument && this.selectedDocument.doc_content) {
      this.quillEditor.root.innerHTML = this.selectedDocument.doc_content;
    }

    console.log('✅ Quill inicializado correctamente sin duplicaciones');
  }
  
  destroyQuill(): void {
    if (this.quillEditor) {
      console.log('🗑 Eliminando instancia previa de Quill...');
      this.quillEditor.root.innerHTML = ''; // Limpia el contenido de Quill
      this.quillEditor = null; // Elimina la instancia
    }
  }
  
  resetModal(): void {
    console.log('🔄 Reiniciando modal y limpiando Quill...');
    this.destroyQuill();
    this.selectedDocument = {}; // Limpiar el objeto seleccionado
  }

  guardarDocumento(): void {
    if (this.quillEditor) {
      this.selectedDocument.doc_content = this.quillEditor.root.innerHTML;
    }

    console.log('Guardando cambios del documento:', this.selectedDocument);

    // 🛑 Cerrar modal correctamente después de guardar
    if (this.editModalInstance) {
      this.editModalInstance.hide();
    }
  }
}