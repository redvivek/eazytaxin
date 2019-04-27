import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermscondnComponent } from './termscondn.component';

describe('TermscondnComponent', () => {
  let component: TermscondnComponent;
  let fixture: ComponentFixture<TermscondnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermscondnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermscondnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
