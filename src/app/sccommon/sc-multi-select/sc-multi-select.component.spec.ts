import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScMultiSelectComponent } from './sc-multi-select.component';

describe('ScMultiSelectComponent', () => {
  let component: ScMultiSelectComponent;
  let fixture: ComponentFixture<ScMultiSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScMultiSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
