import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkDonationDialogComponent } from './bulk-donation-dialog.component';

describe('BulkDonationDialogComponent', () => {
  let component: BulkDonationDialogComponent;
  let fixture: ComponentFixture<BulkDonationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkDonationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkDonationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
