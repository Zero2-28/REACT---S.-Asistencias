export interface User {
  id?: number;
  institution_id: number;
  email: string;
  password: string;
  role: "student" | "teacher" | "admin";
  name?: string;
  created_at?: Date;
}
