import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationDialogComponent } from './donation-dialog.component';

describe('DonationDialogComponent', () => {
  let component: DonationDialogComponent;
  let fixture: ComponentFixture<DonationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
