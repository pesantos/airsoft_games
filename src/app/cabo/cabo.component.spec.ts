import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaboComponent } from './cabo.component';

describe('CaboComponent', () => {
  let component: CaboComponent;
  let fixture: ComponentFixture<CaboComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaboComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
