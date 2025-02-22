import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  private apiUrl: string = 'https://apisprueba.fpfch.gob.mx/api/v1/panel/config/publish/app-doc/';
  private token: string = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjg2OSwibmFtZSI6IkFhclx1MDBmM24gVmFsZGV6IFRlc3QiLCJleHAiOjE3Mjk3ODc3NjN9.T9xaWtCBSbaBC8dHBjT5_oUCIBDWSnZknSiibAgMDgQ';

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
    this.selectedDocument = { ...doc };

    setTimeout(() => {
      this.initQuill();
    }, 300); 

    const modalElement = document.getElementById('editarDocumentoModal');
    if (modalElement) {
      this.editModalInstance = new bootstrap.Modal(modalElement);
      this.editModalInstance.show();
    }
  }
  
  initQuill(): void {
    const quillContainer = document.getElementById('editor-container');
  
    if (this.quillEditor) {
      console.warn('⚠️ Quill ya está inicializado, solo actualizando contenido.');
      if (this.selectedDocument && this.selectedDocument.doc_content) {
        this.quillEditor.clipboard.dangerouslyPasteHTML(this.selectedDocument.doc_content);
      } else {
        this.quillEditor.setText('');
      }
      return;
    }
  
    if (!quillContainer) {
      console.error('❌ No se encontró el contenedor de Quill.');
      return;
    }
  
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

    if (this.selectedDocument && this.selectedDocument.doc_content) {
      this.quillEditor.clipboard.dangerouslyPasteHTML(this.selectedDocument.doc_content);
    } else {
      this.quillEditor.setText('');
    }

    console.log('✅ Quill inicializado correctamente sin duplicaciones');
  }
  
  resetModal(): void {
    console.log('🔄 Reiniciando modal y limpiando Quill...');
    this.selectedDocument = {}; 
  }

  guardarDocumento(): void {
    if (this.quillEditor) {
      this.selectedDocument.doc_content = this.quillEditor.root.innerHTML;
    }

    const updatedDocument = {
      doc_type: this.selectedDocument.doc_type,
      doc_title: this.selectedDocument.doc_title,
      doc_content: this.selectedDocument.doc_content,
      mobile: this.selectedDocument.mobile,
      web: this.selectedDocument.web,
      active: this.selectedDocument.active
    };

    console.log('📤 Enviando documento actualizado:', updatedDocument);

    const headers = new HttpHeaders({
      Authorization: this.token,
      'Content-Type': 'application/json'
    });

    this.http.post(this.apiUrl, updatedDocument, { headers }).subscribe(
      (response) => {
        console.log('✅ Documento actualizado con éxito:', response);

        if (this.editModalInstance) {
          this.editModalInstance.hide();
        }

        this.fetchData();
        alert('Documento actualizado correctamente.');
      },
      (error) => {
        console.error('❌ Error al actualizar el documento:', error);
        alert('Hubo un error al actualizar el documento.');
      }
    );
  }
}