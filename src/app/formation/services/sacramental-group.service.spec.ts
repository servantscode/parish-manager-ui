import { TestBed } from '@angular/core/testing';

import { SacramentalGroupService } from './sacramental-group.service';

describe('SacramentalGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SacramentalGroupService = TestBed.get(SacramentalGroupService);
    expect(service).toBeTruthy();
  });
});
