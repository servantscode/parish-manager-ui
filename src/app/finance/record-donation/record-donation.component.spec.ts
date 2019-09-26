import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordDonationComponent } from './record-donation.component';

describe('RecordDonationComponent', () => {
  let component: RecordDonationComponent;
  let fixture: ComponentFixture<RecordDonationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordDonationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
