import { TestBed } from '@angular/core/testing';

import { MassAvailabilityService } from './mass-availability.service';

describe('MassAvailabilityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MassAvailabilityService = TestBed.get(MassAvailabilityService);
    expect(service).toBeTruthy();
  });
});
