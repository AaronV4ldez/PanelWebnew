import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosDePwebComponent } from './usuarios-de-pweb.component';

describe('UsuariosDePwebComponent', () => {
  let component: UsuariosDePwebComponent;
  let fixture: ComponentFixture<UsuariosDePwebComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsuariosDePwebComponent]
    });
    fixture = TestBed.createComponent(UsuariosDePwebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
