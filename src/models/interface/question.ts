export interface Question {
  id: number;
  question: string;
  type: 'text' | 'table';
  table?: {
    columns: string[];
    rows: number;
  };
}