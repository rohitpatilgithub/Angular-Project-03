import { Component, inject, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Question } from '../../models/interface/question';

@Component({
  selector: 'app-exam',
  imports: [FormsModule, CommonModule,ReactiveFormsModule],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css',
})
export class ExamComponent implements OnInit {
  
  form:FormGroup = new FormGroup({});
  isChecked = false;
  ques:Question [] = [];
  currentIndex: number = 0;
  lastVisitedIndex: number[] = [];
  answers: { [key: string]: any } = {};

  private srv = inject(SharedService);

  ngOnInit(): void {
    this.srv.getQuestions().subscribe((m) => {this.ques = m})
    this.getQuestions();
  }

  getQuestions() {
    this.ques.forEach((el) => {
      if (el.type === 'text') {
        this.form.addControl(String(el.id), new FormControl(''));
      }
    });
    this.lastVisitedIndex[0] = 0;
  }

  next() {
    if (this.currentIndex < this.ques.length - 1) {
      this.currentIndex++;
      this.lastVisitedIndex.push(this.currentIndex);
    }
  }

  skip1() {
    if (this.ques && this.ques.length > 2) {
      this.currentIndex = 2;
      this.lastVisitedIndex.push(this.currentIndex);
    }
  }

  previous() {
    if (this.lastVisitedIndex.length > 1) {
      console.log(this.lastVisitedIndex.pop());
      this.currentIndex = this.lastVisitedIndex[this.lastVisitedIndex.length - 1];
    }
  }

  
}
