import { TestBed } from '@angular/core/testing';

import { FamilyContributionService } from './family-contribution.service';

describe('FamilyContributionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FamilyContributionService = TestBed.get(FamilyContributionService);
    expect(service).toBeTruthy();
  });
});
