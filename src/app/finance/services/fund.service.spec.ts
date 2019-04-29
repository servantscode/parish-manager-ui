import { TestBed } from '@angular/core/testing';

import { FundService } from './donation.service';

describe('FundService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FundService = TestBed.get(FundService);
    expect(service).toBeTruthy();
  });
});
