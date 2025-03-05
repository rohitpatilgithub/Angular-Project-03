export interface Answer {
  [questionId: number]: any[] | string; // Supports text answers & dynamic tables
}