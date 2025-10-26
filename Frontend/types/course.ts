export interface Lesson {
  id: string;
  _id?: string;
  title: string;
  duration: string;
  completed: boolean;
  description?: string;
  weekNumber?: number;
  materials?: any[];
}

export interface Quiz {
  id: string;
  _id?: string;
  title: string;
  questions: number;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  completed: boolean;
  score?: number;
  type?: 'quiz' | 'assignment';
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  progress: number;
  overview: string;
  lessons: Lesson[];
  quizzes: Quiz[];
}
