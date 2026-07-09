import { TestBed } from '@angular/core/testing';

import { DriveBackup } from './drive-backup';

describe('DriveBackup', () => {
  let service: DriveBackup;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriveBackup);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
