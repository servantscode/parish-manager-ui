import { TestBed } from '@angular/core/testing';

import { IncomingDonationService } from './incoming-donation.service';

describe('IncomingDonationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IncomingDonationService = TestBed.get(IncomingDonationService);
    expect(service).toBeTruthy();
  });
});
