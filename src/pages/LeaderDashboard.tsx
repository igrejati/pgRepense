
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Calendar, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useRequireLeader } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Course, CourseSession, Student, Attendance } from '@/types/schema';
import { Skeleton } from '@/components/ui/skeleton';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border shadow-sm rounded-md">
        <p className="font-medium text-xs">{`${label}`}</p>
        <p className="text-xs text-repense-red">{`Presentes: ${payload[0].value}`}</p>
        <p className="text-xs text-muted-foreground">{`Total: ${payload[1]?.value || 25}`}</p>
      </div>
    );
  }
  return null;
};

const LeaderDashboard = () => {
  const navigate = useNavigate();
  const auth = useRequireLeader();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [sessions, setSessions] = useState<CourseSession[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [absentStudents, setAbsentStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.user) return;

      try {
        setLoading(true);

        // Get the leader ID
        const { data: leaderData, error: leaderError } = await supabase
          .from('leaders')
          .select('id')
          .eq('user_id', auth.user.id)
          .single();

        if (leaderError) throw leaderError;

        // Get the leader's first course
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('leader_id', leaderData.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (courseError && courseError.code !== 'PGRST116') {
          throw courseError;
        }

        if (courseData) {
          setCourse(courseData);

          // Get sessions for this course
          const { data: sessionsData, error: sessionsError } = await supabase
            .from('course_sessions')
            .select('*')
            .eq('course_id', courseData.id)
            .order('session_number', { ascending: true });

          if (sessionsError) throw sessionsError;
          setSessions(sessionsData || []);

          // Fetch attendance data for each session
          const attendancePromises = sessionsData.map(async (session) => {
            const { data: attendanceCount, error: attendanceError } = await supabase
              .from('attendance')
              .select('id', { count: 'exact' })
              .eq('session_id', session.id)
              .eq('checked_in', true);

            if (attendanceError) throw attendanceError;

            return {
              session: `Sessão ${session.session_number}`,
              attendance: attendanceCount.length,
              total: courseData.capacity,
              date: new Date(session.session_date).toLocaleDateString('pt-BR')
            };
          });

          const attendanceResults = await Promise.all(attendancePromises);
          setAttendanceData(attendanceResults);

          // Get students enrolled in this course
          const { data: enrolledStudents, error: enrolledError } = await supabase
            .from('student_courses')
            .select('student_id')
            .eq('course_id', courseData.id);

          if (enrolledError) throw enrolledError;

          if (enrolledStudents?.length) {
            const studentIds = enrolledStudents.map(item => item.student_id);
            
            const { data: studentsData, error: studentsError } = await supabase
              .from('students')
              .select('*')
              .in('id', studentIds);

            if (studentsError) throw studentsError;
            setStudents(studentsData || []);

            // Calculate absent students
            const absentCalculationPromises = studentsData.map(async (student) => {
              const { data: studentAttendance, error: studentAttError } = await supabase
                .from('attendance')
                .select('checked_in')
                .eq('student_id', student.id)
                .in('session_id', sessionsData.map(s => s.id));

              if (studentAttError) throw studentAttError;

              const totalSessions = sessionsData.length;
              const attendedSessions = studentAttendance?.filter(a => a.checked_in).length || 0;
              const absentSessions = totalSessions - attendedSessions;
              const attendanceRate = Math.round((attendedSessions / (totalSessions || 1)) * 100);

              return {
                name: student.name,
                sessions: absentSessions,
                rate: attendanceRate
              };
            });

            const absentResults = await Promise.all(absentCalculationPromises);
            const sortedAbsent = absentResults
              .filter(student => student.rate < 85)
              .sort((a, b) => a.rate - b.rate)
              .slice(0, 3);

            setAbsentStudents(sortedAbsent);
          }
        }
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar dados',
          description: error.message || 'Ocorreu um erro ao carregar os dados do dashboard.',
        });
      } finally {
        setLoading(false);
      }
    };

    if (auth.isAuthenticated && !loading) {
      fetchData();
    }
  }, [auth.isAuthenticated, auth.user]);

  if (auth.loading) {
    return (
      <DashboardLayout userRole="leader" userName="Carregando...">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded animate-pulse w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate attendance rate from fetched data
  const totalAttendance = attendanceData.reduce((sum, session) => sum + session.attendance, 0);
  const totalStudents = attendanceData.reduce((sum, session) => sum + session.total, 0);
  const attendanceRate = totalStudents ? Math.round((totalAttendance / totalStudents) * 100) : 0;

  if (!course) {
    return (
      <DashboardLayout userRole="leader" userName={auth.user?.user_metadata?.name || "Líder"}>
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-2xl font-semibold mb-4">Nenhum curso ativo encontrado</h2>
          <p className="text-muted-foreground mb-4">Você ainda não possui cursos ativos sob sua liderança.</p>
          <Button onClick={() => navigate('/profile')}>
            Ir para o perfil
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="leader" userName={auth.user?.user_metadata?.name || "Líder"}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground mt-1">
              Grupo {course.repense_group} | {course.format} | {new Date(course.initial_date).toLocaleDateString('pt-BR')} até {new Date(course.end_date).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div className="flex gap-2">
            {course.whatsapp_group_link && (
              <a 
                href={course.whatsapp_group_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                  <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                </svg>
                Grupo WhatsApp
              </a>
            )}
            <Button onClick={() => navigate('/attendance/new')}>
              Nova Presença
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Alunos</CardTitle>
              <Users size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{course.enrolled_count || 0}</div>
              <p className="text-xs text-muted-foreground">de {course.capacity} vagas</p>
              <Progress className="h-2 mt-2" value={((course.enrolled_count || 0) / course.capacity) * 100} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Taxa de Presença</CardTitle>
              <CheckCircle size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{attendanceRate}%</div>
              <p className="text-xs text-muted-foreground">média de todas as sessões</p>
              <Progress 
                className="h-2 mt-2" 
                value={attendanceRate} 
                indicators={[
                  { value: 70, className: "bg-yellow-500" },
                  { value: 90, className: "bg-green-500" }
                ]}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Sessões</CardTitle>
              <Calendar size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {sessions.filter(s => s.is_completed).length}/{sessions.length}
              </div>
              <p className="text-xs text-muted-foreground">sessões completadas</p>
              <Progress 
                className="h-2 mt-2" 
                value={(sessions.filter(s => s.is_completed).length / (sessions.length || 1)) * 100} 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <BookOpen size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-600">{course.status || 'Ativo'}</Badge>
                <span className="text-sm">{course.course_tag}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Curso em andamento</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="border-b">
            <TabsList className="bg-transparent p-0 h-12">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-repense-red data-[state=active]:shadow-none rounded-none h-12 px-4"
              >
                Visão Geral
              </TabsTrigger>
              <TabsTrigger 
                value="sessions" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-repense-red data-[state=active]:shadow-none rounded-none h-12 px-4"
              >
                Sessões
              </TabsTrigger>
              <TabsTrigger 
                value="students" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-repense-red data-[state=active]:shadow-none rounded-none h-12 px-4"
              >
                Alunos
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Presença por Sessão</CardTitle>
                  <CardDescription>Número de alunos presentes em cada sessão</CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={attendanceData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="session" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="attendance" 
                          stroke="#CC2936" 
                          strokeWidth={3}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alunos com Baixa Presença</CardTitle>
                  <CardDescription>Alunos que estão faltando mais frequentemente</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <Skeleton className="h-12 w-36" />
                          <Skeleton className="h-6 w-12" />
                        </div>
                      ))}
                    </div>
                  ) : absentStudents.length > 0 ? (
                    <div className="space-y-4">
                      {absentStudents.map((student, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {student.sessions} sessões perdidas
                            </p>
                          </div>
                          <Badge variant={student.rate < 60 ? "destructive" : "outline"}>
                            {student.rate}%
                          </Badge>
                        </div>
                      ))}

                      <Button variant="link" className="p-0 mt-2 h-auto">
                        Ver todos os alunos
                      </Button>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      Nenhum aluno com baixa presença encontrado.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sessions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Sessões do Curso</CardTitle>
                <CardDescription>Gerencie as sessões do seu curso</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array(5).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : sessions.length > 0 ? (
                  <div className="space-y-4">
                    {sessions.map((session, i) => (
                      <div 
                        key={session.id}
                        className="flex items-center justify-between p-4 border rounded-md"
                      >
                        <div>
                          <p className="font-medium">Sessão {session.session_number}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.is_completed
                              ? `Concluída em ${new Date(session.session_date).toLocaleDateString('pt-BR')}`
                              : new Date(session.session_date) <= new Date()
                                ? `Próxima: ${new Date(session.session_date).toLocaleDateString('pt-BR')}`
                                : `Agendada para ${new Date(session.session_date).toLocaleDateString('pt-BR')}`
                            }
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={
                              session.is_completed
                                ? "bg-green-600" 
                                : new Date(session.session_date) <= new Date()
                                  ? "bg-yellow-600"
                                  : "bg-gray-300 text-gray-700"
                            }
                          >
                            {session.is_completed
                              ? "Concluída" 
                              : new Date(session.session_date) <= new Date()
                                ? "Próxima"
                                : "Pendente"
                            }
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/sessions/${session.id}`)}
                          >
                            {session.is_completed
                              ? "Detalhes" 
                              : new Date(session.session_date) <= new Date()
                                ? "Registrar"
                                : "Ver"
                            }
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    Nenhuma sessão encontrada para este curso.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="students" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lista de Alunos</CardTitle>
                    <CardDescription>Total de {students.length} alunos matriculados</CardDescription>
                  </div>
                  <Button>
                    Exportar Lista
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array(10).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : students.length > 0 ? (
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div key={student.id} className="p-3 border rounded-md flex justify-between items-center">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {student.email} | {student.phone}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/students/${student.id}`)}>
                          Detalhes
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    Nenhum aluno matriculado neste curso.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default LeaderDashboard;
