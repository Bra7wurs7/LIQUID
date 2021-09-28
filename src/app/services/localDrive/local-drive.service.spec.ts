import { TestBed } from '@angular/core/testing';

import { LocalDriveService } from './local-drive.service';

describe('LocalDriveService', () => {
  let service: LocalDriveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalDriveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
