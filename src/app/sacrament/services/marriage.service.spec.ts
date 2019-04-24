import { TestBed } from '@angular/core/testing';

import { MarriageService } from './confirmation.service';

describe('MarriageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MarriageService = TestBed.get(MarriageService);
    expect(service).toBeTruthy();
  });
});
