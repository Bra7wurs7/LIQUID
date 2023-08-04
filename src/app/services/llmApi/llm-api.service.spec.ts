import { TestBed } from '@angular/core/testing';

import { LlmApiService } from './llm-api.service';

describe('LlmApiService', () => {
  let service: LlmApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LlmApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
