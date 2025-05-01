
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCheck } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

interface SessionSummaryCardProps {
  notes: string;
  setNotes: (notes: string) => void;
  presentCount: number;
  absentCount: number;
  totalCount: number;
  isSubmitting: boolean;
  saveAttendance: () => void;
}

const SessionSummaryCard: React.FC<SessionSummaryCardProps> = ({
  notes,
  setNotes,
  presentCount,
  absentCount,
  totalCount,
  isSubmitting,
  saveAttendance
}) => {
  const navigate = useNavigate();
  
  return (
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
                  {totalCount ? Math.round((presentCount / totalCount) * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-repense-red" 
                  style={{ width: `${totalCount ? (presentCount / totalCount) * 100 : 0}%` }}
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
  );
};

export default SessionSummaryCard;
