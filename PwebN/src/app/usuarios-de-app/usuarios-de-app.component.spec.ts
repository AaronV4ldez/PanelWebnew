import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosDeAppComponent } from './usuarios-de-app.component';

describe('UsuariosDeAppComponent', () => {
  let component: UsuariosDeAppComponent;
  let fixture: ComponentFixture<UsuariosDeAppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsuariosDeAppComponent]
    });
    fixture = TestBed.createComponent(UsuariosDeAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
