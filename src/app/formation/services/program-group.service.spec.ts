import { TestBed } from '@angular/core/testing';

import { ProgramGroupService } from './program-group.service';

describe('ProgramGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProgramGroupService = TestBed.get(ProgramGroupService);
    expect(service).toBeTruthy();
  });
});
