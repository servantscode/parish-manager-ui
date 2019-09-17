import { TestBed } from '@angular/core/testing';

import { ApiLocatorService } from './api-locator.service';

describe('ApiLocatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiLocatorService = TestBed.get(ApiLocatorService);
    expect(service).toBeTruthy();
  });
});
