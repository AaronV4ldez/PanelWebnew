import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrosDeCobroComponent } from './parametros-de-cobro.component';

describe('ParametrosDeCobroComponent', () => {
  let component: ParametrosDeCobroComponent;
  let fixture: ComponentFixture<ParametrosDeCobroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParametrosDeCobroComponent]
    });
    fixture = TestBed.createComponent(ParametrosDeCobroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
