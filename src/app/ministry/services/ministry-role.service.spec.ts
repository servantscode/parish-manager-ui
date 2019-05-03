import { TestBed } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { MinistryRoleService } from './ministry-role.service';

describe('MinistryRoleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MinistryRoleService = TestBed.get(MinistryRoleService);
    expect(service).toBeTruthy();
  });
});
