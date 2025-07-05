import { TestBed } from '@angular/core/testing';

import { HotelWebsiteService } from './hotel-website.service';

describe('HotelWebsiteService', () => {
  let service: HotelWebsiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelWebsiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
