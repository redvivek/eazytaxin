import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainmenusComponent } from './mainmenus.component';

describe('MainmenusComponent', () => {
  let component: MainmenusComponent;
  let fixture: ComponentFixture<MainmenusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainmenusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainmenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
