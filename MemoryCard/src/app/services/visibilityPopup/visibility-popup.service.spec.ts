import { TestBed } from '@angular/core/testing';

import { VisibilityPopupService } from './visibility-popup.service';

describe('VisibilityPopupService', () => {
  let service: VisibilityPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisibilityPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
