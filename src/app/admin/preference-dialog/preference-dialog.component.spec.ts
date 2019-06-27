import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceDialogComponent } from './preference-dialog.component';

describe('PreferenceDialogComponent', () => {
  let component: PreferenceDialogComponent;
  let fixture: ComponentFixture<PreferenceDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
