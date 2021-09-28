import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit {
  lorem: string = '';
  constructor(http: HttpClient) {
    http.request('GET', 'https://jaspervdj.be/lorem-markdownum/markdown.txt', {responseType: 'text'}).toPromise().then((ret) => { this.lorem = ret })
  }

  ngOnInit() {

  }

}
