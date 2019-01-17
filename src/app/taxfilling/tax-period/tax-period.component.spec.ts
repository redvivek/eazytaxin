import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxPeriodComponent } from './tax-period.component';

describe('TaxPeriodComponent', () => {
  let component: TaxPeriodComponent;
  let fixture: ComponentFixture<TaxPeriodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxPeriodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
