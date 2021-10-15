import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Category } from 'src/app/models/category.model';
import { Note } from 'src/app/models/note.model';
import { GenericPanelComponent } from '../generic-panel/generic-panel.component';

@Component({
  selector: 'app-note-panel',
  templateUrl: './note-panel.component.html',
  styleUrls: ['./note-panel.component.scss']
})
export class NotePanelComponent extends GenericPanelComponent implements OnInit {
  @ViewChild('contentOutlet') contentOutlet!: HTMLElement;

  @Input() noteName?: string;
  @Input() editMode: boolean = false;
  @Input() categories?: Map<string, Category>;
  @Input() notes?: Map<string, Note>;

  note: Note = new Note();
  category?: Category;
  filteredCategoryNames: string[] = []


  constructor(private http: HttpClient, private elRef: ElementRef, private messageService: MessageService) {
    super();
  }

  searchCategory(event: any) {
    this.filteredCategoryNames = []
    for (const key of this.categories?.keys() ?? []) {
      if(key.includes(event.query)) {
        this.filteredCategoryNames.push(key);
      }
    };
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
    this.updateCategory();
    if (this.panel) {
      this.panel.htmlElement = this.elRef.nativeElement;
    }
    console.log(this.contentOutlet);
  }

  getLorem() {
    this.http.request('GET', 'https://jaspervdj.be/lorem-markdownum/markdown.txt', { responseType: 'text' }).toPromise().then((ret) => { this.note = { uniqueName: 'Lorem Markdownum', content: ret, relatedElements: [] } })
  }


  updateCategory(){
    if (this.note.categoryName) {
      this.category = this.categories?.get(this.note.categoryName);
      if(this.category === undefined) {
        this.messageService.add({
          severity: 'error',
          summary: `Unknown Category ${this.note.categoryName}`,
        })
      }
    }
  }

  log(msg: any) {
    console.log(msg);
  }
}
