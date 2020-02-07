import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilySplitDialogComponent } from './family-split-dialog.component';

describe('FamilySplitDialogComponent', () => {
  let component: FamilySplitDialogComponent;
  let fixture: ComponentFixture<FamilySplitDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilySplitDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilySplitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
