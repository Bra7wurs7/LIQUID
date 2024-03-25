import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotePanelComponent } from './note-panel.component';

describe('NoteCardComponent', () => {
  let component: NotePanelComponent;
  let fixture: ComponentFixture<NotePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
