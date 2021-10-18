import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { surveyDto } from 'src/app/models/survey/survey.model';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  submitted: boolean = false;

  survey: surveyDto = {
    q1: 3,
    q2: 3,
    q3: 3,
    q4: 3,
    q5: 3,
    q6: 3,
    q7: 3,
    q8: 3,
    q9: 3,
    q10: 3,
    q1freetext: '',
    q2freetext: '',
    q3freetext: '',
    q4freetext: '',
    q5freetext: '',
    q6freetext: '',
    q7freetext: '',
    q8freetext: '',
    q9freetext: '',
    q10freetext: '',
    anythingelse: '',
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.submitted = window.localStorage.getItem('surveySubmitted') === 'true' ? true : false;
  }

  submit() {
    this.http.post('http://localhost:8080/survey', this.survey).toPromise().then((succ) => {
      window.localStorage.setItem('surveySubmitted', 'true')
      this.submitted = true;
    })
  }
}
