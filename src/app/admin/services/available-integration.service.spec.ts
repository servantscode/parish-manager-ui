import { TestBed } from '@angular/core/testing';

import { AvailableIntegrationService } from './available-integration.service';

describe('AvailableIntegrationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AvailableIntegrationService = TestBed.get(AvailableIntegrationService);
    expect(service).toBeTruthy();
  });
});
