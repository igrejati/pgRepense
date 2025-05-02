
import { supabase } from '@/integrations/supabase/client';
import { Student, CourseSession } from '@/types/schema';
import { StudentAttendance } from '@/types/attendance';

// Fetch attendance data from Supabase
export const fetchAttendanceData = async (leaderUserId: string, sessionId: string | undefined) => {
  try {
    // Get the leader ID
    const { data: leaderData, error: leaderError } = await supabase
      .from('leaders')
      .select('id')
      .eq('user_id', leaderUserId)
      .single();

    if (leaderError) throw leaderError;

    let targetSessionId = sessionId;
    let targetSession: CourseSession | null = null;
    let courseName = '';

    if (sessionId === 'new') {
      // Get leader's first active course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('leader_id', leaderData.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (courseError) throw courseError;
      
      // Find next incomplete session
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('course_sessions')
        .select('*')
        .eq('course_id', courseData.id)
        .eq('is_completed', false)
        .order('session_number', { ascending: true })
        .limit(1);

      if (sessionsError) throw sessionsError;

      if (sessionsData && sessionsData.length > 0) {
        targetSession = sessionsData[0];
        targetSessionId = targetSession.id.toString();
        courseName = courseData.title || 'Curso';
      } else {
        throw new Error('Nenhuma sessão pendente encontrada para este curso.');
      }
    } else {
      // Get session data
      const numericSessionId = parseInt(targetSessionId as string, 10);
      if (isNaN(numericSessionId)) {
        throw new Error('ID da sessão inválido');
      }
      
      const { data: session, error: sessionError } = await supabase
        .from('course_sessions')
        .select('*')
        .eq('id', numericSessionId)
        .single();

      if (sessionError) throw sessionError;
      targetSession = session;

      // Get course name
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('title')
        .eq('id', session.course_id)
        .single();

      if (courseError) throw courseError;
      courseName = course.title || 'Curso';
    }

    if (!targetSession) throw new Error('Sessão não encontrada');

    // Get enrolled students for this course
    const { data: enrolledStudents, error: enrolledError } = await supabase
      .from('student_courses')
      .select('student_id')
      .eq('course_id', targetSession.course_id);

    if (enrolledError) throw enrolledError;

    let attendance: StudentAttendance[] = [];

    if (enrolledStudents && enrolledStudents.length > 0) {
      const studentIds = enrolledStudents.map(s => s.student_id).filter(Boolean);

      // Get student details
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .in('id', studentIds);

      if (studentsError) throw studentsError;

      // Get existing attendance records
      const numericSessionId = typeof targetSession.id === 'string' 
        ? parseInt(targetSession.id, 10) 
        : targetSession.id;
        
      const { data: existingAttendance, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('session_id', numericSessionId);

      if (attendanceError) throw attendanceError;

      // Create attendance data with existing records if available
      attendance = students.map(student => {
        const record = existingAttendance?.find(a => a.student_id === student.id);
        return {
          id: record?.id,
          student,
          present: record ? record.checked_in : false,
          justification: record?.justification || ''
        };
      });
    }

    return { 
      sessionData: targetSession, 
      courseName, 
      attendanceData: attendance, 
      notes: targetSession.notes || '' 
    };
  } catch (error) {
    throw error;
  }
};

// Save attendance records to Supabase
export const saveAttendanceRecords = async (
  sessionData: CourseSession,
  attendanceData: StudentAttendance[],
  notes: string
) => {
  try {
    // Update session notes
    await supabase
      .from('course_sessions')
      .update({ 
        notes,
        is_completed: true
      })
      .eq('id', sessionData.id);
    
    // Process attendance records
    for (const student of attendanceData) {
      if (student.id) {
        // Update existing record
        await supabase
          .from('attendance')
          .update({
            checked_in: student.present,
            justification: student.present ? null : student.justification,
            updated_at: new Date().toISOString()
          })
          .eq('id', student.id);
      } else {
        // Insert new record
        await supabase
          .from('attendance')
          .insert({
            session_id: sessionData.id,
            student_id: student.student.id,
            checked_in: student.present,
            justification: student.present ? null : student.justification,
            check_in_time: new Date().toISOString()
          });
      }
    }
    return true;
  } catch (error) {
    throw error;
  }
};
