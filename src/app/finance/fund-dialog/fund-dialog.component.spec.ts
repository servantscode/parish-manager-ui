import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundDialogComponent } from './fund-dialog.component';

describe('FundDialogComponent', () => {
  let component: FundDialogComponent;
  let fixture: ComponentFixture<FundDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
