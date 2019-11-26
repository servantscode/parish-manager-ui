import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewIncomingDonationsComponent } from './review-incoming-donations.component';

describe('ReviewIncomingDonationsComponent', () => {
  let component: ReviewIncomingDonationsComponent;
  let fixture: ComponentFixture<ReviewIncomingDonationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewIncomingDonationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewIncomingDonationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
