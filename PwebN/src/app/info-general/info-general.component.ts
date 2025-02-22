import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
declare var bootstrap: any; // Asegura que Bootstrap esté disponible

@Component({
  selector: 'app-info-general',
  templateUrl: './info-general.component.html',
  styleUrls: ['./info-general.component.css']
})
export class InfoGeneralComponent implements OnInit {
  docs: any[] = [];
  filteredDocs: any[] = [];
  searchText: string = '';
  isLoading: boolean = false;
  selectedDocument: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
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

  editDocument(doc: any): void {
    console.log('Editar documento:', doc);
    // Aquí puedes abrir un modal o redirigir a otra página para editar
  }

  viewDocument(doc: any): void {
    this.selectedDocument = doc;
    setTimeout(() => {
      const modal = new bootstrap.Modal(document.getElementById('documentoModal'));
      modal.show();
    }, 0);
  }
}