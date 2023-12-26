import { TestBed } from '@angular/core/testing';

import { SpecialCharsService } from './special-chars.service';

describe('SpecialCharsService', () => {
  let service: SpecialCharsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecialCharsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
