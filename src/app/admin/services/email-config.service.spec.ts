import { TestBed } from '@angular/core/testing';

import { EmailConfigService } from './email-config.service';

describe('EmailConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmailConfigService = TestBed.get(EmailConfigService);
    expect(service).toBeTruthy();
  });
});
