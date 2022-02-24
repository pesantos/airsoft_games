import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaletaComponent } from './maleta.component';

describe('MaletaComponent', () => {
  let component: MaletaComponent;
  let fixture: ComponentFixture<MaletaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaletaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaletaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
