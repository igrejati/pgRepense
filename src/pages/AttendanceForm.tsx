
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, FileCheck, ChevronLeft } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useRequireLeader } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Student, CourseSession } from '@/types/schema';

interface StudentAttendance {
  id?: number;
  student: Student;
  present: boolean;
  justification: string;
}

const AttendanceForm = () => {
  const navigate = useNavigate();
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
    const fetchData = async () => {
      if (!auth.isAuthenticated) return;

      try {
        setLoading(true);

        // Get the leader ID
        const { data: leaderData, error: leaderError } = await supabase
          .from('leaders')
          .select('id')
          .eq('user_id', auth.user!.id)
          .single();

        if (leaderError) throw leaderError;

        let targetSessionId = sessionId;
        let targetSession;

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
            setSessionData(targetSession);
            setCourseName(courseData.title || 'Curso');
          } else {
            throw new Error('Nenhuma sessão pendente encontrada para este curso.');
          }
        } else {
          // Get session data
          const { data: session, error: sessionError } = await supabase
            .from('course_sessions')
            .select('*')
            .eq('id', targetSessionId)
            .single();

          if (sessionError) throw sessionError;
          targetSession = session;
          setSessionData(session);

          // Get course name
          const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('title')
            .eq('id', session.course_id)
            .single();

          if (courseError) throw courseError;
          setCourseName(course.title || 'Curso');
        }

        if (!targetSession) throw new Error('Sessão não encontrada');

        // Get the notes for this session
        setNotes(targetSession.notes || '');

        // Get enrolled students for this course
        const { data: enrolledStudents, error: enrolledError } = await supabase
          .from('student_courses')
          .select('student_id')
          .eq('course_id', targetSession.course_id);

        if (enrolledError) throw enrolledError;

        if (enrolledStudents && enrolledStudents.length > 0) {
          const studentIds = enrolledStudents.map(s => s.student_id).filter(Boolean);

          // Get student details
          const { data: students, error: studentsError } = await supabase
            .from('students')
            .select('*')
            .in('id', studentIds);

          if (studentsError) throw studentsError;

          // Get existing attendance records
          const { data: existingAttendance, error: attendanceError } = await supabase
            .from('attendance')
            .select('*')
            .eq('session_id', targetSession.id);

          if (attendanceError) throw attendanceError;

          // Create attendance data with existing records if available
          const attendance = students.map(student => {
            const record = existingAttendance?.find(a => a.student_id === student.id);
            return {
              id: record?.id,
              student,
              present: record ? record.checked_in : false,
              justification: record?.justification || ''
            };
          });

          setAttendanceData(attendance);
        }
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
      fetchData();
    }
  }, [auth.isAuthenticated, auth.user, sessionId]);

  // Filter students based on attendance status and search term
  const filteredStudents = attendanceData.filter(student => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'present' && student.present) || 
      (filter === 'absent' && !student.present);
    
    const matchesSearch = 
      student.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.student.email && student.student.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

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
      
      // Success message
      toast({
        title: "Registro de presença salvo!",
        description: `Presença registrada para a Sessão ${sessionData.session_number} do curso ${courseName}.`,
      });
      
      // Navigate back
      navigate('/dashboard');
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

  // Present and absent counts
  const presentCount = attendanceData.filter(s => s.present).length;
  const absentCount = attendanceData.length - presentCount;

  if (loading || auth.loading) {
    return (
      <DashboardLayout userRole="leader" userName={auth.user?.user_metadata?.name || "Líder"}>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-8 w-20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-6 w-64" />
              </CardHeader>
              <CardContent>
                {Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full mb-4" />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-6 w-56" />
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!sessionData) {
    return (
      <DashboardLayout userRole="leader" userName={auth.user?.user_metadata?.name || "Líder"}>
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-2xl font-semibold mb-4">Sessão não encontrada</h2>
          <p className="text-muted-foreground mb-4">A sessão solicitada não foi encontrada ou você não tem permissão para acessá-la.</p>
          <Button onClick={() => navigate('/dashboard')}>
            Voltar para o Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="leader" userName={auth.user?.user_metadata?.name || "Líder"}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/dashboard')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                Registro de Presença - Sessão {sessionData.session_number}
              </h1>
              <p className="text-muted-foreground">
                {courseName} | {new Date(sessionData.session_date).toLocaleDateString('pt-BR')} | {sessionData.topic || 'Sem tópico'}
              </p>
            </div>
          </div>
          <Badge className="w-fit">{sessionData.is_completed ? 'Concluída' : 'Em Andamento'}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Lista de Alunos</CardTitle>
                  <CardDescription>
                    Total de {attendanceData.length} alunos matriculados
                  </CardDescription>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={markAllPresent}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Todos Presentes
                  </Button>
                  <Button variant="outline" size="sm" onClick={markAllAbsent}>
                    <XCircle className="h-4 w-4 mr-1" />
                    Todos Ausentes
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-full">
                    <Input 
                      placeholder="Buscar por nome ou email" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Tabs defaultValue="all" className="w-auto" onValueChange={setFilter}>
                    <TabsList>
                      <TabsTrigger value="all">
                        Todos ({attendanceData.length})
                      </TabsTrigger>
                      <TabsTrigger value="present">
                        Presentes ({presentCount})
                      </TabsTrigger>
                      <TabsTrigger value="absent">
                        Ausentes ({absentCount})
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div key={student.student.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-md">
                    <div className="flex items-start gap-3 flex-grow">
                      <div className="flex items-center h-6">
                        <Checkbox 
                          id={`student-${student.student.id}`} 
                          checked={student.present}
                          onCheckedChange={() => toggleAttendance(student)}
                        />
                      </div>
                      <div className="flex flex-col">
                        <Label 
                          htmlFor={`student-${student.student.id}`}
                          className={`font-medium ${!student.present ? 'text-muted-foreground' : ''}`}
                        >
                          {student.student.name}
                        </Label>
                        <div className="text-xs text-muted-foreground">
                          {student.student.email} | {student.student.phone}
                        </div>
                        
                        {!student.present && (
                          <div className="mt-2">
                            <Input
                              placeholder="Justificativa (opcional)"
                              value={student.justification}
                              onChange={(e) => updateJustification(student, e.target.value)}
                              className="text-sm h-8"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Badge variant={student.present ? "default" : "outline"} className={student.present ? "bg-green-600" : ""}>
                        {student.present ? "Presente" : "Ausente"}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {filteredStudents.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">
                    Nenhum aluno encontrado com os filtros selecionados.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo da Sessão</CardTitle>
              <CardDescription>
                Visão geral da presença nesta sessão
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Estatísticas de Presença</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-md text-center">
                      <div className="text-3xl font-bold">{presentCount}</div>
                      <div className="text-xs text-muted-foreground">Presentes</div>
                    </div>
                    <div className="p-4 bg-muted rounded-md text-center">
                      <div className="text-3xl font-bold">{absentCount}</div>
                      <div className="text-xs text-muted-foreground">Ausentes</div>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Taxa de presença</span>
                      <span className="font-medium">
                        {attendanceData.length ? Math.round((presentCount / attendanceData.length) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-repense-red" 
                        style={{ width: `${attendanceData.length ? (presentCount / attendanceData.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Notas da Sessão</h3>
                  <Textarea 
                    placeholder="Adicione notas sobre esta sessão (opcional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="pt-4 space-y-2">
                  <Button 
                    className="w-full bg-repense-red hover:bg-opacity-90" 
                    onClick={saveAttendance}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <FileCheck className="mr-2 h-4 w-4" />
                        Salvar Registro de Presença
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate('/dashboard')}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AttendanceForm;
