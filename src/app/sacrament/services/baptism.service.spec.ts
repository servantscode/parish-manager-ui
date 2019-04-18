import { TestBed } from '@angular/core/testing';

import { BaptismService } from './baptism.service';

describe('BaptismService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaptismService = TestBed.get(BaptismService);
    expect(service).toBeTruthy();
  });
});
