
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CourseSession } from '@/types/schema';
import { StudentAttendance } from '@/types/attendance';
import { fetchAttendanceData, saveAttendanceRecords } from '@/utils/attendanceUtils';

interface UseAttendanceFormProps {
  userId: string | undefined;
  sessionId: string | undefined;
}

export function useAttendanceForm({ userId, sessionId }: UseAttendanceFormProps) {
  const { toast } = useToast();
  
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<CourseSession | null>(null);
  const [courseName, setCourseName] = useState('');
  const [attendanceData, setAttendanceData] = useState<StudentAttendance[]>([]);

  // Load attendance data
  useEffect(() => {
    const loadAttendanceData = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const data = await fetchAttendanceData(userId, sessionId);
        
        setSessionData(data.sessionData);
        setCourseName(data.courseName);
        setAttendanceData(data.attendanceData);
        setNotes(data.notes);
      } catch (error: any) {
        console.error('Error fetching attendance data:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar dados',
          description: error.message || 'Ocorreu um erro ao carregar os dados da sessão.',
        });
      } finally {
        setLoading(false);
      }
    };

    loadAttendanceData();
  }, [userId, sessionId, toast]);

  // Toggle attendance status
  const toggleAttendance = (student: StudentAttendance) => {
    setAttendanceData(prev => 
      prev.map(s => 
        s.student.id === student.student.id 
          ? { ...s, present: !s.present, justification: !s.present ? '' : s.justification } 
          : s
      )
    );
  };

  // Update justification text
  const updateJustification = (student: StudentAttendance, text: string) => {
    setAttendanceData(prev => 
      prev.map(s => 
        s.student.id === student.student.id 
          ? { ...s, justification: text } 
          : s
      )
    );
  };

  // Bulk actions
  const markAllPresent = () => {
    setAttendanceData(prev => 
      prev.map(student => ({ ...student, present: true, justification: '' }))
    );
  };

  const markAllAbsent = () => {
    setAttendanceData(prev => 
      prev.map(student => ({ ...student, present: false, justification: '' }))
    );
  };

  // Save attendance records
  const saveAttendance = async () => {
    if (!sessionData) return;
    
    setIsSubmitting(true);
    
    try {
      await saveAttendanceRecords(sessionData, attendanceData, notes);
      
      // Success message
      toast({
        title: "Registro de presença salvo!",
        description: `Presença registrada para a Sessão ${sessionData.session_number} do curso ${courseName}.`,
      });
      
    } catch (error: any) {
      console.error('Error saving attendance:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar presença",
        description: error.message || "Ocorreu um erro ao registrar a presença. Por favor, tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate attendance stats
  const presentCount = attendanceData.filter(s => s.present).length;
  const absentCount = attendanceData.length - presentCount;

  return {
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    isSubmitting,
    notes,
    setNotes,
    loading,
    sessionData,
    courseName,
    attendanceData,
    toggleAttendance,
    updateJustification,
    markAllPresent,
    markAllAbsent,
    saveAttendance,
    presentCount,
    absentCount,
    totalCount: attendanceData.length
  };
}
