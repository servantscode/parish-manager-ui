import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScEnumComponent } from './sc-enum.component';

describe('ScEnumComponent', () => {
  let component: ScEnumComponent;
  let fixture: ComponentFixture<ScEnumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScEnumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScEnumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
