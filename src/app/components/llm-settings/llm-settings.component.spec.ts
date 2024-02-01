import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlmSettingsComponent } from './llm-settings.component';

describe('SettingsMenuComponent', () => {
  let component: LlmSettingsComponent;
  let fixture: ComponentFixture<LlmSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LlmSettingsComponent]
    });
    fixture = TestBed.createComponent(LlmSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
