import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { PontosComponent } from './pontos.component';

describe('PontosComponent', () => {
  let component: PontosComponent;
  let fixture: ComponentFixture<PontosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PontosComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PontosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Deveria criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
