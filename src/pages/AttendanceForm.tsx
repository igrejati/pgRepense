
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useRequireLeader } from '@/lib/auth';
import DashboardLayout from '@/layouts/DashboardLayout';
import { CourseSession } from '@/types/schema';
import { StudentAttendance } from '@/types/attendance';
import { fetchAttendanceData, saveAttendanceRecords } from '@/utils/attendanceUtils';
import StudentListCard from '@/components/attendance/StudentListCard';
import SessionSummaryCard from '@/components/attendance/SessionSummaryCard';
import AttendanceHeader from '@/components/attendance/AttendanceHeader';
import LoadingState from '@/components/attendance/LoadingState';
import NotFoundState from '@/components/attendance/NotFoundState';

const AttendanceForm = () => {
  const { toast } = useToast();
  const auth = useRequireLeader();
  const { sessionId } = useParams();
  
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<CourseSession | null>(null);
  const [courseName, setCourseName] = useState('');
  const [attendanceData, setAttendanceData] = useState<StudentAttendance[]>([]);

  useEffect(() => {
    const loadAttendanceData = async () => {
      if (!auth.isAuthenticated || !auth.user) return;

      try {
        setLoading(true);
        const data = await fetchAttendanceData(auth.user.id, sessionId);
        
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

    if (auth.isAuthenticated) {
      loadAttendanceData();
    }
  }, [auth.isAuthenticated, auth.user, sessionId, toast]);

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
      
      // Navigate back - handled by the SessionSummaryCard component
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

  // Present and absent counts for summary
  const presentCount = attendanceData.filter(s => s.present).length;
  const absentCount = attendanceData.length - presentCount;

  if (loading || auth.loading) {
    return <LoadingState userName={auth.user?.user_metadata?.name || "Líder"} />;
  }

  if (!sessionData) {
    return <NotFoundState userName={auth.user?.user_metadata?.name || "Líder"} />;
  }

  return (
    <DashboardLayout userRole="leader" userName={auth.user?.user_metadata?.name || "Líder"}>
      <div className="space-y-6">
        <AttendanceHeader sessionData={sessionData} courseName={courseName} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StudentListCard
            attendanceData={attendanceData}
            filter={filter}
            searchTerm={searchTerm}
            setFilter={setFilter}
            setSearchTerm={setSearchTerm}
            toggleAttendance={toggleAttendance}
            updateJustification={updateJustification}
            markAllPresent={markAllPresent}
            markAllAbsent={markAllAbsent}
          />

          <SessionSummaryCard
            notes={notes}
            setNotes={setNotes}
            presentCount={presentCount}
            absentCount={absentCount}
            totalCount={attendanceData.length}
            isSubmitting={isSubmitting}
            saveAttendance={saveAttendance}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AttendanceForm;
