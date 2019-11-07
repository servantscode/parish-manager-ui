import { TestBed } from '@angular/core/testing';

import { ParishService } from './parish.service';

describe('ParishService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParishService = TestBed.get(ParishService);
    expect(service).toBeTruthy();
  });
});
