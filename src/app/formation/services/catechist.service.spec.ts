import { TestBed } from '@angular/core/testing';

import { CatechistService } from './catechist.service';

describe('CatechistService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CatechistService = TestBed.get(CatechistService);
    expect(service).toBeTruthy();
  });
});
