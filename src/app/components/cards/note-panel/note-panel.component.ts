import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Note } from 'src/app/models/note.model';
import { AbstractPanelComponent } from '../abstract-panel/abstract-panel.component';

@Component({
  selector: 'app-note-panel',
  templateUrl: './note-panel.component.html',
  styleUrls: ['./note-panel.component.scss']
})
export class NotePanelComponent extends AbstractPanelComponent implements OnInit {
  @ViewChild('contentOutlet') contentOutlet!: HTMLElement;

  @Input() noteName?: string;
  @Input() editMode: boolean = false;
  @Input() notes?: Map<string, Note>;

  note: Note = new Note();

  constructor(private http: HttpClient, private elRef: ElementRef, private messageService: MessageService) {
    super();
  }

  ngOnInit() {
    if (this.noteName) {
      let noteOrUndefined = this.notes?.get(this.noteName);
      if (noteOrUndefined) {
        this.note = noteOrUndefined;
      } else {
        this.messageService.add({severity: 'error', summary: `Note with name ${this.noteName} does not exist.`})
        this.closePanelEvent.emit();
      }
    }
    if (this.panel) {
      this.panel.htmlElement = this.elRef.nativeElement;
    }
  }
}
