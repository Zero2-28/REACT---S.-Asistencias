export interface AttendanceHistory {
  id?: number;
  attendance_id: number;
  modified_by: number;
  previous_status?: string;
  new_status?: string;
  previous_check_in?: string;
  new_check_in?: string;
  previous_check_out?: string;
  new_check_out?: string;
  change_reason?: string;
  modified_at?: Date;
}
