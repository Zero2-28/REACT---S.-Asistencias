export interface Attendance {
  id?: number;
  student_id: number;
  teacher_id: number;
  institution_id: number;
  date: string; // YYYY-MM-DD
  check_in_time?: string; // HH:mm:ss
  check_out_time?: string;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
  created_at?: Date;
}
