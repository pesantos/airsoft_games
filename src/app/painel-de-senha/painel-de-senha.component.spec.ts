import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelDeSenhaComponent } from './painel-de-senha.component';

describe('PainelDeSenhaComponent', () => {
  let component: PainelDeSenhaComponent;
  let fixture: ComponentFixture<PainelDeSenhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PainelDeSenhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PainelDeSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create alguma coisa', () => {
    expect(component).toBeTruthy();
  });
});
