import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmisionesEnVivoComponent } from './transmisiones-en-vivo.component';

describe('TransmisionesEnVivoComponent', () => {
  let component: TransmisionesEnVivoComponent;
  let fixture: ComponentFixture<TransmisionesEnVivoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransmisionesEnVivoComponent]
    });
    fixture = TestBed.createComponent(TransmisionesEnVivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
