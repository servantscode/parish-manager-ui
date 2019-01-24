import { TestBed } from '@angular/core/testing';

import { AvailabiltyService } from './availabilty.service';

describe('AvailabiltyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AvailabiltyService = TestBed.get(AvailabiltyService);
    expect(service).toBeTruthy();
  });
});
