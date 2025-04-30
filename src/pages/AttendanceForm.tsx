
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

// Mock data
const sessionData = {
  id: '1',
  courseId: '1',
  courseName: 'Discipulado Básico',
  sessionNumber: 3,
  sessionDate: '29/03/2023',
  topic: 'Fundamentos da Fé',
  isCompleted: false,
};

const students = [
  { id: '1', name: 'Ana Santos', email: 'ana@example.com', phone: '(11) 9876-5432', present: true, justification: '' },
  { id: '2', name: 'Bruno Silva', email: 'bruno@example.com', phone: '(11) 9123-4567', present: true, justification: '' },
  { id: '3', name: 'Carlos Oliveira', email: 'carlos@example.com', phone: '(11) 8765-4321', present: false, justification: 'Viagem a trabalho' },
  { id: '4', name: 'Daniela Costa', email: 'daniela@example.com', phone: '(11) 7654-3210', present: true, justification: '' },
  { id: '5', name: 'Eduardo Santos', email: 'eduardo@example.com', phone: '(11) 6543-2109', present: true, justification: '' },
  { id: '6', name: 'Fernanda Lima', email: 'fernanda@example.com', phone: '(11) 5432-1098', present: false, justification: 'Doente' },
  { id: '7', name: 'Gustavo Pereira', email: 'gustavo@example.com', phone: '(11) 4321-0987', present: true, justification: '' },
  { id: '8', name: 'Helena Souza', email: 'helena@example.com', phone: '(11) 3210-9876', present: true, justification: '' },
  { id: '9', name: 'Igor Rocha', email: 'igor@example.com', phone: '(11) 2109-8765', present: false, justification: '' },
  { id: '10', name: 'Júlia Melo', email: 'julia@example.com', phone: '(11) 1098-7654', present: true, justification: '' },
];

const AttendanceForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sessionId } = useParams();
  const [filter, setFilter] = useState('all');
  const [attendanceData, setAttendanceData] = useState<typeof students>(students);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState('');

  // Filter students based on attendance status and search term
  const filteredStudents = attendanceData.filter(student => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'present' && student.present) || 
      (filter === 'absent' && !student.present);
    
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Toggle attendance status
  const toggleAttendance = (id: string) => {
    setAttendanceData(prev => 
      prev.map(student => 
        student.id === id 
          ? { ...student, present: !student.present, justification: !student.present ? '' : student.justification } 
          : student
      )
    );
  };

  // Update justification text
  const updateJustification = (id: string, text: string) => {
    setAttendanceData(prev => 
      prev.map(student => 
        student.id === id 
          ? { ...student, justification: text } 
          : student
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
    setIsSubmitting(true);
    
    try {
      // This would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success message
      toast({
        title: "Registro de presença salvo!",
        description: `Presença registrada para a Sessão ${sessionData.sessionNumber} do curso ${sessionData.courseName}.`,
      });
      
      // Navigate back
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar presença",
        description: "Ocorreu um erro ao registrar a presença. Por favor, tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Present and absent counts
  const presentCount = attendanceData.filter(s => s.present).length;
  const absentCount = attendanceData.length - presentCount;

  return (
    <DashboardLayout>
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
                Registro de Presença - Sessão {sessionData.sessionNumber}
              </h1>
              <p className="text-muted-foreground">
                {sessionData.courseName} | {sessionData.sessionDate} | {sessionData.topic}
              </p>
            </div>
          </div>
          <Badge className="w-fit">{sessionData.isCompleted ? 'Concluída' : 'Em Andamento'}</Badge>
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
                  <div key={student.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-md">
                    <div className="flex items-start gap-3 flex-grow">
                      <div className="flex items-center h-6">
                        <Checkbox 
                          id={`student-${student.id}`} 
                          checked={student.present}
                          onCheckedChange={() => toggleAttendance(student.id)}
                        />
                      </div>
                      <div className="flex flex-col">
                        <Label 
                          htmlFor={`student-${student.id}`}
                          className={`font-medium ${!student.present ? 'text-muted-foreground' : ''}`}
                        >
                          {student.name}
                        </Label>
                        <div className="text-xs text-muted-foreground">
                          {student.email} | {student.phone}
                        </div>
                        
                        {!student.present && (
                          <div className="mt-2">
                            <Input
                              placeholder="Justificativa (opcional)"
                              value={student.justification}
                              onChange={(e) => updateJustification(student.id, e.target.value)}
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
                        {Math.round((presentCount / attendanceData.length) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-repense-red" 
                        style={{ width: `${(presentCount / attendanceData.length) * 100}%` }}
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
