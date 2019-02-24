import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuynowComponent } from './buynow.component';

describe('BuynowComponent', () => {
  let component: BuynowComponent;
  let fixture: ComponentFixture<BuynowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuynowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuynowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
