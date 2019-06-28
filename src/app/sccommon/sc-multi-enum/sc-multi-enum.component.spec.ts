import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScMultiEnumComponent } from './sc-multi-enum.component';

describe('ScMultiEnumComponent', () => {
  let component: ScMultiEnumComponent;
  let fixture: ComponentFixture<ScMultiEnumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScMultiEnumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScMultiEnumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
