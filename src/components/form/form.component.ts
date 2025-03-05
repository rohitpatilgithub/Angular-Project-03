import { Component, inject, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { Answer } from '../../models/interface/answer';
import { Question } from '../../models/interface/question';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  imports: [CommonModule, FormsModule],
})
export class FormComponent implements OnInit {
  currentIndex: number = 0;
  lastIndex: number[] = [];
  disabledValue: boolean = false;

  questions: Question[] = [];
  answers: { [key: number]: any } = {};
  isRecording: { [key: number]: boolean } = {};
  audioURLs: { [key: number]: string } = {};

  private sharedService = inject(SharedService);

  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.sharedService.getQuestions().subscribe({
      next: (data: Question[]) => {
        this.questions = data;
        this.initializeAnswers();
        this.loadAudioFromStorage();
      },
      error: (err: any) => console.error('Error fetching questions:', err),
    });
    this.lastIndex[0] = 0;
  }

  initializeAnswers(): void {
    this.questions.forEach((q) => {
      if (q.type === 'table') {
        this.answers[q.id] = [this.createEmptyRow(q.table?.columns)];
      } else {
        this.answers[q.id] = '';
      }
    });
  }

  createEmptyRow(columns: string[] | undefined): { [key: string]: string } {
    if (!columns) return {};
    const newRow: { [key: string]: string } = {};
    columns.forEach((col) => (newRow[col] = ''));
    return newRow;
  }

  addRow(questionId: number, columns: string[] | undefined): void {
    if (!columns) return;
    this.answers[questionId].push(this.createEmptyRow(columns));
  }
  
  removeRow(questionId: number): void {
    if (this.answers[questionId] && this.answers[questionId].length > 1) {
      this.answers[questionId].pop();
    }
  }

  toggleRecording(questionId: number): void {
    if (this.isRecording[questionId]) {
      this.stopRecording(questionId);
    } else {
      this.startRecording(questionId);
    }
  }

  startRecording(questionId: number): void {
    this.isRecording[questionId] = true;
    this.audioChunks = [];

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.start();

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        this.audioURLs[questionId] = audioUrl;

        // Save to localStorage
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          localStorage.setItem(`audio_${questionId}`, reader.result as string);
        };
      };
    });
  }

  stopRecording(questionId: number): void {
    this.isRecording[questionId] = false;
    this.mediaRecorder?.stop();
  }

  loadAudioFromStorage(): void {
    this.questions.forEach((q) => {
      const storedAudio = localStorage.getItem(`audio_${q.id}`);
      if (storedAudio) {
        this.audioURLs[q.id] = storedAudio;
      }
    });
  }

  submitAnswers(): void {
    this.sharedService.sendAnswers(this.answers).subscribe({
      next: (response: Answer) =>
        console.log('Answers submitted successfully', response),
      error: (err: any) => console.error('Error submitting answers:', err),
    });
  }

  next() {
    if (this.currentIndex < this.questions.length) {
      this.currentIndex++;
    }
    this.lastIndex.push(this.currentIndex);
  }

  previous() {
    if (this.currentIndex > 0) {
      this.lastIndex.pop();
      this.currentIndex = this.lastIndex[this.lastIndex.length - 1];
    }
  }

  skip() {
    if (this.currentIndex == 1) {
      this.currentIndex = 3;
      this.lastIndex.push(this.currentIndex);
    }
  }
}
