import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasTabla2Component } from './noticias-tabla-2.component';

describe('NoticiasTabla2Component', () => {
  let component: NoticiasTabla2Component;
  let fixture: ComponentFixture<NoticiasTabla2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoticiasTabla2Component]
    });
    fixture = TestBed.createComponent(NoticiasTabla2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
