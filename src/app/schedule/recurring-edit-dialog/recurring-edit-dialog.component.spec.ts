import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringEditDialogComponent } from './recurring-edit-dialog.component';

describe('RecurringEditDialogComponent', () => {
  let component: RecurringEditDialogComponent;
  let fixture: ComponentFixture<RecurringEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecurringEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
