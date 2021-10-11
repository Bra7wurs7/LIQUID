import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { GenericPanel } from 'src/app/models/note-panel.model';
import { Note } from 'src/app/models/note.model';
import { AttributeTable } from 'src/app/models/noteAttribute.model';

@Component({
  selector: 'app-note-panel',
  templateUrl: './note-panel.component.html',
  styleUrls: ['./note-panel.component.scss']
})
export class NotePanelComponent implements OnInit {
  @Input() panel?: GenericPanel;
  @Input() categories?: Map<string, Category>;
  @Input() notes?: Map<string, Note>;
  @Input() noteName?: string;
  @Input() editMode: boolean = false;

  note: Note = {content: 'loading', uniqueName: 'loading'};
  category?: Category;



  constructor(private http: HttpClient, private elRef :ElementRef) {

  }

  ngOnInit() {
    if(this.noteName) {
      let noteOrUndefined = this.notes?.get(this.noteName);
      if (noteOrUndefined) {
        this.note = noteOrUndefined;
      }
    }
    if(this.note.categoryName) {
      this.category = this.categories?.get(this.note.categoryName);
    }
    if(this.panel) {
      console.log(this.panel);
      this.panel.htmlElement = this.elRef.nativeElement;
      console.log(this.panel);
    }
  }

  getLorem() {
    this.http.request('GET', 'https://jaspervdj.be/lorem-markdownum/markdown.txt', { responseType: 'text' }).toPromise().then((ret) => { this.note = {uniqueName: 'Lorem Markdownum', content: ret} })
  }

}
