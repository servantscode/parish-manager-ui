import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScAutoCompleteComponent } from './sc-auto-complete.component';

describe('ScAutoCompleteComponent', () => {
  let component: ScAutoCompleteComponent;
  let fixture: ComponentFixture<ScAutoCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScAutoCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScAutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
