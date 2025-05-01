
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { StudentAttendance } from '@/types/attendance';

interface StudentListCardProps {
  attendanceData: StudentAttendance[];
  filter: string;
  searchTerm: string;
  setFilter: (filter: string) => void;
  setSearchTerm: (searchTerm: string) => void;
  toggleAttendance: (student: StudentAttendance) => void;
  updateJustification: (student: StudentAttendance, text: string) => void;
  markAllPresent: () => void;
  markAllAbsent: () => void;
}

const StudentListCard: React.FC<StudentListCardProps> = ({
  attendanceData,
  filter,
  searchTerm,
  setFilter,
  setSearchTerm,
  toggleAttendance,
  updateJustification,
  markAllPresent,
  markAllAbsent
}) => {
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
  
  // Present and absent counts
  const presentCount = attendanceData.filter(s => s.present).length;
  const absentCount = attendanceData.length - presentCount;

  return (
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
  );
};

export default StudentListCard;
