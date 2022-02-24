import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeletorComponent } from './seletor.component';

describe('SeletorComponent', () => {
  let component: SeletorComponent;
  let fixture: ComponentFixture<SeletorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeletorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeletorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
