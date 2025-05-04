
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

  // Load attendance data without authentication checks
  useEffect(() => {
    const loadAttendanceData = async () => {
      try {
        setLoading(true);
        
        // Using mock data for demonstration
        const mockSessionId = sessionId || 'mock-session';
        
        // Generate mock data based on the session ID or use defaults
        const mockSessionData: CourseSession = {
          id: parseInt(mockSessionId.replace('mock-session', '1')),
          course_id: 1,
          session_number: parseInt(mockSessionId.charAt(mockSessionId.length - 1)) || 1,
          session_date: new Date().toISOString(),
          topic: "Introdução ao Curso",
          notes: "Esta é a primeira sessão do curso.",
          is_completed: false,
          created_at: new Date().toISOString()
        };
        
        const mockCourseName = mockSessionId.includes('evangelho') ? 
          'PG Repense o Evangelho (Presencial)' : 
          mockSessionId.includes('igreja') ? 
          'PG Repense a Igreja (Online)' : 
          'PG Repense a Espiritualidade (Presencial)';
        
        // Create properly typed mock attendance data
        const mockAttendanceData: StudentAttendance[] = Array.from({ length: 15 }, (_, i) => ({
          student: {
            id: `${i + 1}`,
            name: `Aluno ${i + 1}`,
            email: `aluno${i + 1}@example.com`,
            phone: `+55 11 9${Math.floor(Math.random() * 10000)}${Math.floor(Math.random() * 10000)}`,
            birth_date: "1990-01-01",
            gender: "Não informado",
            marital_status: "Não informado",
            cpf: "000.000.000-00",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            registration_date: new Date().toISOString()
          },
          present: Math.random() > 0.2, // 80% chance of being present
          justification: Math.random() > 0.7 ? 'Problemas pessoais' : ''
        }));
        
        const mockNotes = "Notas da sessão para o instrutor.";
        
        setSessionData(mockSessionData);
        setCourseName(mockCourseName);
        setAttendanceData(mockAttendanceData);
        setNotes(mockNotes);
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

  // Save attendance records without authentication checks
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
