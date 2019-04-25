import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOverrideDialogComponent } from './admin-override-dialog.component';

describe('AdminOverrideDialogComponent', () => {
  let component: AdminOverrideDialogComponent;
  let fixture: ComponentFixture<AdminOverrideDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOverrideDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOverrideDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
