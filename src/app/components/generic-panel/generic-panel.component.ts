import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GenericPanel } from 'src/app/models/panel.model';

@Component({
  selector: 'app-generic-panel',
  template: '',
})
export abstract class GenericPanelComponent {
  @Output() internalLinkActivatedEvent: EventEmitter<string> = new EventEmitter()
  @Output() moveUpEvent: EventEmitter<void> = new EventEmitter()
  @Output() moveDownEvent: EventEmitter<void> = new EventEmitter()
  @Output() closePanelEvent: EventEmitter<void> = new EventEmitter()
  @Input() panel?: GenericPanel;
  @Input() isActivePanel?: boolean = false;

  constructor() { } 
}
