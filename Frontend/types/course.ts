export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  questions: number;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  completed: boolean;
  score?: number;
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
