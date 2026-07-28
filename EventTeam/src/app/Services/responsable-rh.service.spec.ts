import { TestBed } from '@angular/core/testing';
import { ResponsableRhService } from './responsable-rh.service';
describe('ResponsableRhService', () => {
  let service: ResponsableRhService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsableRhService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
