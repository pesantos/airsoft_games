import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegressivoComponent } from './regressivo.component';

describe('RegressivoComponent', () => {
  let component: RegressivoComponent;
  let fixture: ComponentFixture<RegressivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegressivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegressivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
