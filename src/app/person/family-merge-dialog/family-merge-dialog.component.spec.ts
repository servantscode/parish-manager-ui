import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyMergeDialogComponent } from './family-merge-dialog.component';

describe('FamilyMergeDialogComponent', () => {
  let component: FamilyMergeDialogComponent;
  let fixture: ComponentFixture<FamilyMergeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyMergeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyMergeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
