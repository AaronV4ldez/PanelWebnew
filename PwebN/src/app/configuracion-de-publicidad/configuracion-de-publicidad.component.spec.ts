import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionDePublicidadComponent } from './configuracion-de-publicidad.component';

describe('ConfiguracionDePublicidadComponent', () => {
  let component: ConfiguracionDePublicidadComponent;
  let fixture: ComponentFixture<ConfiguracionDePublicidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfiguracionDePublicidadComponent]
    });
    fixture = TestBed.createComponent(ConfiguracionDePublicidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
