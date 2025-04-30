
export interface Leader {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  dob: string | null;
  role: 'leader' | 'pastor';
  user_id: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface Course {
  id: number;
  title: string | null;
  repense_group: string;
  leader_id: number | null;
  capacity: number;
  enrolled_count: number | null;
  course_tag: string | null;
  status: string | null;
  is_active: boolean | null;
  whatsapp_group_link: string | null;
  format: string | null;
  initial_date: string;
  end_date: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface CourseSession {
  id: number;
  course_id: number | null;
  session_date: string;
  session_number: number | null;
  topic: string | null;
  is_completed: boolean | null;
  notes: string | null;
  created_at: string | null;
}

export interface Student {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  birth_date: string | null;
  gender: string | null;
  marital_status: string | null;
  cpf: string | null;
  created_at: string | null;
  updated_at: string | null;
  registration_date: string | null;
}

export interface StudentCourse {
  id: number;
  student_id: string | null;
  course_id: number | null;
  course_tag: string | null;
  registration_date: string | null;
  attended: boolean | null;
  is_youth_course: boolean | null;
  feedback: string | null;
  created_at: string | null;
}

export interface Attendance {
  id: number;
  student_id: string | null;
  session_id: number | null;
  checked_in: boolean | null;
  check_in_time: string | null;
  justification: string | null;
  leader_comment: string | null;
  created_at: string | null;
  updated_at: string | null;
}
