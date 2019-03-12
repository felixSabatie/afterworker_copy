import { TestBed } from '@angular/core/testing';

import { PlacePollService } from './place-poll.service';

describe('PlacePollService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlacePollService = TestBed.get(PlacePollService);
    expect(service).toBeTruthy();
  });
});
