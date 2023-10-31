import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Article } from 'src/app/models/article.model';

@Component({
  selector: 'app-note-panel',
  templateUrl: './note-panel.component.html',
  styleUrls: ['./note-panel.component.scss']
})
export class NotePanelComponent implements OnInit {
  @ViewChild('contentOutlet') contentOutlet!: HTMLElement;
  
  @Output() internalLinkActivatedEvent: EventEmitter<string> = new EventEmitter()
  @Output() moveUpEvent: EventEmitter<void> = new EventEmitter()
  @Output() moveDownEvent: EventEmitter<void> = new EventEmitter()
  @Output() closePanelEvent: EventEmitter<void> = new EventEmitter()
  @Input() isActivePanel?: boolean = false;
  @Input() articleName?: string;
  @Input() editMode: boolean = false;
  @Input() articles?: Map<string, Article>;

  note: Article = new Article();

  constructor(private http: HttpClient, private elRef: ElementRef, private messageService: MessageService) {}

  ngOnInit() {
    if (this.articleName) {
      let articleOrUndefined = this.articles?.get(this.articleName);
      if (articleOrUndefined) {
        this.note = articleOrUndefined;
      } else {
        this.messageService.add({severity: 'error', summary: `Article with name ${this.articleName} does not exist.`})
        this.closePanelEvent.emit();
      }
    }
  }
}
