import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from '../models/interface/question';
import { Answer } from '../models/interface/answer';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private apiurl = 'http://localhost:3000';
  private http = inject(HttpClient);

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiurl}/questions`);
  }

  sendAnswers(answer: Answer): Observable<Answer> {
    return this.http.post<Answer>(`${this.apiurl}/answers`, answer);
  }

  getAnswers(): Observable<Answer> {
    return this.http.get<Answer>(`${this.apiurl}/answers`);
  }
}
