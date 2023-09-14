import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Article } from 'src/app/models/article.model';
import { AbstractPanelComponent } from '../abstract-panel/abstract-panel.component';

@Component({
  selector: 'app-note-panel',
  templateUrl: './note-panel.component.html',
  styleUrls: ['./note-panel.component.scss']
})
export class NotePanelComponent extends AbstractPanelComponent implements OnInit {
  @ViewChild('contentOutlet') contentOutlet!: HTMLElement;

  @Input() articleName?: string;
  @Input() editMode: boolean = false;
  @Input() articles?: Map<string, Article>;

  note: Article = new Article();

  constructor(private http: HttpClient, private elRef: ElementRef, private messageService: MessageService) {
    super();
  }

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
    if (this.panel) {
      this.panel.htmlElement = this.elRef.nativeElement;
    }
  }
}
