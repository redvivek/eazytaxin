import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewdetailsComponent } from './reviewdetails.component';

describe('ReviewdetailsComponent', () => {
  let component: ReviewdetailsComponent;
  let fixture: ComponentFixture<ReviewdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
