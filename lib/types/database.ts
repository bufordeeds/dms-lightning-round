export interface Employee {
  id: string;
  name: string;
  created_at: string;
}

export interface Session {
  id: string;
  question: string;
  asked_by?: string | null;
  created_at: string;
  completed_at: string | null;
  answers?: Answer[];
}

export interface Answer {
  id: string;
  session_id: string;
  employee_id: string;
  answer: string | null;
  created_at: string;
  employee?: Employee;
}

export type Database = {
  public: {
    Tables: {
      employees: {
        Row: Employee;
        Insert: Omit<Employee, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Employee, 'id' | 'created_at'>>;
      };
      sessions: {
        Row: Session;
        Insert: Omit<Session, 'id' | 'created_at' | 'answers'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Session, 'id' | 'created_at' | 'answers'>>;
      };
      answers: {
        Row: Answer;
        Insert: Omit<Answer, 'id' | 'created_at' | 'employee'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Answer, 'id' | 'created_at' | 'employee'>>;
      };
    };
  };
};