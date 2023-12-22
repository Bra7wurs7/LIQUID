import { TestBed } from '@angular/core/testing';

import { ContextMenusService } from './context-menus.service';

describe('ContextMenusService', () => {
  let service: ContextMenusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContextMenusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
