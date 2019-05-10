import { TestBed } from '@angular/core/testing';

import { MassIntentionService } from './mass-intention.service';

describe('MassIntentionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MassIntentionService = TestBed.get(MassIntentionService);
    expect(service).toBeTruthy();
  });
});
