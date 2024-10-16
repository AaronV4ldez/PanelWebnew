import { Component } from '@angular/core';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-noticias-tabla-2',
  templateUrl: './noticias-tabla-2.component.html',
  styleUrls: ['./noticias-tabla-2.component.css']
})
export class NoticiasTabla2Component {
  titulo: string = '';
  descripcion: string = '';
  imagen: any = null;

  // Método para manejar el cambio de imagen y mostrar vista previa
  onImageChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      const imgElement = document.getElementById('vista-previa') as HTMLImageElement;
      imgElement.src = e.target.result;
      imgElement.style.display = 'block'; // Mostrar imagen en vista previa
      this.imagen = e.target.result; // Guardar la imagen
    };
    
    reader.readAsDataURL(file);
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
      // Mostrar el modal
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  confirmar() {
    // Aquí puedes manejar el envío del formulario o realizar cualquier acción al confirmar.
    console.log('Confirmar');
  }
}
