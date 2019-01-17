import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxesPaidComponent } from './taxes-paid.component';

describe('TaxesPaidComponent', () => {
  let component: TaxesPaidComponent;
  let fixture: ComponentFixture<TaxesPaidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxesPaidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxesPaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
