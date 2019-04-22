import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotationsComponent } from './notations.component';

describe('NotationsComponent', () => {
  let component: NotationsComponent;
  let fixture: ComponentFixture<NotationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
