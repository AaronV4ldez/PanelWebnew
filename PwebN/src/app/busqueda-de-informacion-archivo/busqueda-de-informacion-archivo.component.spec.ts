import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaDeInformacionArchivoComponent } from './busqueda-de-informacion-archivo.component';

describe('BusquedaDeInformacionArchivoComponent', () => {
  let component: BusquedaDeInformacionArchivoComponent;
  let fixture: ComponentFixture<BusquedaDeInformacionArchivoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusquedaDeInformacionArchivoComponent]
    });
    fixture = TestBed.createComponent(BusquedaDeInformacionArchivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
