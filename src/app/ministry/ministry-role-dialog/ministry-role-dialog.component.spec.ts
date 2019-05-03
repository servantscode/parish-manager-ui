import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryRoleDialogComponent } from './ministry-role-dialog.component';

describe('MinistryRoleDialogComponent', () => {
  let component: MinistryRoleDialogComponent;
  let fixture: ComponentFixture<MinistryRoleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinistryRoleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinistryRoleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
