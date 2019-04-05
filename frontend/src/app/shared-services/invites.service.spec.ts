import { TestBed } from '@angular/core/testing';

import { InvitesService } from './invites.service';

describe('InvitesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InvitesService = TestBed.get(InvitesService);
    expect(service).toBeTruthy();
  });
});
