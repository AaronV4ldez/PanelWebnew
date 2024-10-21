import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarPublicidadComponent } from './configurar-publicidad.component';

describe('ConfigurarPublicidadComponent', () => {
  let component: ConfigurarPublicidadComponent;
  let fixture: ComponentFixture<ConfigurarPublicidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigurarPublicidadComponent]
    });
    fixture = TestBed.createComponent(ConfigurarPublicidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
