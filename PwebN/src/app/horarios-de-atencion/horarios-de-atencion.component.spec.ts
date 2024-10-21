import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorariosDeAtencionComponent } from './horarios-de-atencion.component';

describe('HorariosDeAtencionComponent', () => {
  let component: HorariosDeAtencionComponent;
  let fixture: ComponentFixture<HorariosDeAtencionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HorariosDeAtencionComponent]
    });
    fixture = TestBed.createComponent(HorariosDeAtencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
