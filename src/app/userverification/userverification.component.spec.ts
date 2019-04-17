import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserverificationComponent } from './userverification.component';

describe('UserverificationComponent', () => {
  let component: UserverificationComponent;
  let fixture: ComponentFixture<UserverificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserverificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserverificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
