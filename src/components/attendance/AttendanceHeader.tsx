
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { CourseSession } from '@/types/schema';

interface AttendanceHeaderProps {
  sessionData: CourseSession;
  courseName: string;
}

const AttendanceHeader: React.FC<AttendanceHeaderProps> = ({ sessionData, courseName }) => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default AttendanceHeader;
