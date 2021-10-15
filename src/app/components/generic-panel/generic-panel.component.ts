import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { Note } from 'src/app/models/note.model';
import { GenericPanel } from 'src/app/models/panel.model';

@Component({
  selector: 'app-generic-panel',
  templateUrl: './generic-panel.component.html',
  styleUrls: ['./generic-panel.component.scss']
})
export abstract class GenericPanelComponent implements OnInit {
  @Output() internalLinkActivatedEvent: EventEmitter<string> = new EventEmitter()
  @Output() moveUpEvent: EventEmitter<void> = new EventEmitter()
  @Output() moveDownEvent: EventEmitter<void> = new EventEmitter()
  @Output() closePanelEvent: EventEmitter<void> = new EventEmitter()
  @Input() panel?: GenericPanel;
  @Input() isActivePanel?: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
