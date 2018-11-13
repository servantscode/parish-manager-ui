import { TestBed } from '@angular/core/testing';

import { MinistryService } from './ministry.service';

describe('MinistryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MinistryService = TestBed.get(MinistryService);
    expect(service).toBeTruthy();
  });
});
