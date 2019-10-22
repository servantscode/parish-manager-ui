import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceFormComponent } from './preference-form.component';

describe('PreferenceFormComponent', () => {
  let component: PreferenceFormComponent;
  let fixture: ComponentFixture<PreferenceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
