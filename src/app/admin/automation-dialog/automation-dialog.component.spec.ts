import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomationDialogComponent } from './automation-dialog.component';

describe('AutomationDialogComponent', () => {
  let component: AutomationDialogComponent;
  let fixture: ComponentFixture<AutomationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutomationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
