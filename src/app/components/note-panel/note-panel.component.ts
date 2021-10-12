import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { Note } from 'src/app/models/note.model';
import { GenericPanelComponent } from '../generic-panel/generic-panel.component';

@Component({
  selector: 'app-note-panel',
  templateUrl: './note-panel.component.html',
  styleUrls: ['./note-panel.component.scss']
})
export class NotePanelComponent extends GenericPanelComponent implements OnInit {
  @Input() noteName?: string;
  @Input() editMode: boolean = false;
  @Input() categories?: Map<string, Category>;
  @Input() notes?: Map<string, Note>;

  note: Note = new Note();
  category?: Category;



  constructor(private http: HttpClient, private elRef: ElementRef) {
    super();
  }

  ngOnInit() {
    if (this.noteName) {
      let noteOrUndefined = this.notes?.get(this.noteName);
      if (noteOrUndefined) {
        this.note = noteOrUndefined;
      }
    }
    if (this.note.categoryName) {
      this.category = this.categories?.get(this.note.categoryName);
    }
    if (this.panel) {
      this.panel.htmlElement = this.elRef.nativeElement;
    }
  }

  getLorem() {
    this.http.request('GET', 'https://jaspervdj.be/lorem-markdownum/markdown.txt', { responseType: 'text' }).toPromise().then((ret) => { this.note = { uniqueName: 'Lorem Markdownum', content: ret } })
  }


  log(msg: any) {
    console.log(msg);
  }
}
