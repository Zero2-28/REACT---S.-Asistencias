export interface Student {
  id?: number;
  user_id: number;
  institution_id: number;
  student_code: string;
  grade?: string;
  section?: string;
  phone?: string;
  parent_contact?: string;
  enrollment_date?: Date;
  status?: string;
}
