import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasTabla1Component } from './noticias-tabla-1.component';

describe('NoticiasTabla1Component', () => {
  let component: NoticiasTabla1Component;
  let fixture: ComponentFixture<NoticiasTabla1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoticiasTabla1Component]
    });
    fixture = TestBed.createComponent(NoticiasTabla1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
