
import { Student, CourseSession } from '@/types/schema';

export interface StudentAttendance {
  id?: number;
  student: Student;
  present: boolean;
  justification: string;
}
