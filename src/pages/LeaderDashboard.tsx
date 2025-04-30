
import React, { useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Calendar, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Sample data
const attendanceData = [
  { session: 'Sessão 1', attendance: 20, total: 25 },
  { session: 'Sessão 2', attendance: 18, total: 25 },
  { session: 'Sessão 3', attendance: 22, total: 25 },
  { session: 'Sessão 4', attendance: 19, total: 25 },
  { session: 'Sessão 5', attendance: 17, total: 25 },
  { session: 'Sessão 6', attendance: 15, total: 25 },
  { session: 'Sessão 7', attendance: 20, total: 25 },
];

const courseInfo = {
  title: 'Discipulado Básico',
  group: 'Grupo Alpha',
  format: 'Presencial',
  startDate: '15/03/2023',
  endDate: '30/04/2023',
  whatsappLink: 'https://chat.whatsapp.com/example',
  capacity: 25,
  enrolled: 25,
  status: 'Ativo',
  tag: 'discipulado_basico',
  sessionsCompleted: 5,
  totalSessions: 9,
};

const absentStudents = [
  { name: 'Maria Silva', sessions: 2, rate: 71 },
  { name: 'João Oliveira', sessions: 3, rate: 57 },
  { name: 'Ana Souza', sessions: 2, rate: 71 },
];

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
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate attendance rate
  const totalAttendance = attendanceData.reduce((sum, session) => sum + session.attendance, 0);
  const totalStudents = attendanceData.reduce((sum, session) => sum + session.total, 0);
  const attendanceRate = Math.round((totalAttendance / totalStudents) * 100);

  return (
    <DashboardLayout userRole="leader" userName="João Silva">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{courseInfo.title}</h1>
            <p className="text-muted-foreground mt-1">
              Grupo {courseInfo.group} | {courseInfo.format} | {courseInfo.startDate} até {courseInfo.endDate}
            </p>
          </div>
          <div className="flex gap-2">
            <a 
              href={courseInfo.whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
              </svg>
              Grupo WhatsApp
            </a>
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
              <div className="text-3xl font-bold">{courseInfo.enrolled}</div>
              <p className="text-xs text-muted-foreground">de {courseInfo.capacity} vagas</p>
              <Progress className="h-2 mt-2" value={(courseInfo.enrolled / courseInfo.capacity) * 100} />
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
              <div className="text-3xl font-bold">{courseInfo.sessionsCompleted}/{courseInfo.totalSessions}</div>
              <p className="text-xs text-muted-foreground">sessões completadas</p>
              <Progress 
                className="h-2 mt-2" 
                value={(courseInfo.sessionsCompleted / courseInfo.totalSessions) * 100} 
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
                <Badge className="bg-green-600">{courseInfo.status}</Badge>
                <span className="text-sm">{courseInfo.tag}</span>
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
                <div className="space-y-4">
                  {Array.from({ length: courseInfo.totalSessions }).map((_, i) => (
                    <div 
                      key={i}
                      className="flex items-center justify-between p-4 border rounded-md"
                    >
                      <div>
                        <p className="font-medium">Sessão {i + 1}</p>
                        <p className="text-xs text-muted-foreground">
                          {i < courseInfo.sessionsCompleted 
                            ? `Concluída em ${new Date(2023, 2 + Math.floor(i/2), 15 + (i%2)*7).toLocaleDateString('pt-BR')}`
                            : i === courseInfo.sessionsCompleted
                              ? `Próxima: ${new Date(2023, 2 + Math.floor(i/2), 15 + (i%2)*7).toLocaleDateString('pt-BR')}`
                              : `Agendada para ${new Date(2023, 2 + Math.floor(i/2), 15 + (i%2)*7).toLocaleDateString('pt-BR')}`
                          }
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={
                            i < courseInfo.sessionsCompleted 
                              ? "bg-green-600" 
                              : i === courseInfo.sessionsCompleted
                                ? "bg-yellow-600"
                                : "bg-gray-300 text-gray-700"
                          }
                        >
                          {i < courseInfo.sessionsCompleted 
                            ? "Concluída" 
                            : i === courseInfo.sessionsCompleted
                              ? "Próxima"
                              : "Pendente"
                          }
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/sessions/${i+1}`)}
                        >
                          {i < courseInfo.sessionsCompleted 
                            ? "Detalhes" 
                            : i === courseInfo.sessionsCompleted
                              ? "Registrar"
                              : "Ver"
                          }
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="students" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lista de Alunos</CardTitle>
                    <CardDescription>Total de {courseInfo.enrolled} alunos matriculados</CardDescription>
                  </div>
                  <Button>
                    Exportar Lista
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* This would be a data table in a full implementation */}
                  <p className="text-muted-foreground text-center py-8">
                    A visualização detalhada dos alunos será implementada em breve.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default LeaderDashboard;
