import { TestBed } from '@angular/core/testing';

import { SystemIntegrationService } from './system-integration.service';

describe('SystemIntegrationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SystemIntegrationService = TestBed.get(SystemIntegrationService);
    expect(service).toBeTruthy();
  });
});
