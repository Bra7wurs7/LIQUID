import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationViewerComponent } from './conversation-viewer.component';

describe('ConversationViewerComponent', () => {
  let component: ConversationViewerComponent;
  let fixture: ComponentFixture<ConversationViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConversationViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
