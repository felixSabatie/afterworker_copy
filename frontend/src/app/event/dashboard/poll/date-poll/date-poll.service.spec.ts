import { TestBed } from '@angular/core/testing';

import { DatePollService } from './date-poll.service';

describe('DatePollService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatePollService = TestBed.get(DatePollService);
    expect(service).toBeTruthy();
  });
});
