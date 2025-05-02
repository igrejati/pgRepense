
import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotFoundStateProps {
  userName: string;
}

const NotFoundState: React.FC<NotFoundStateProps> = ({ userName }) => {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout userRole="leader" userName={userName}>
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-6 text-center">
        <div className="rounded-full bg-muted p-6">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 9L9 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 9L15 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Sessão não encontrada</h2>
          <p className="text-muted-foreground">
            Não conseguimos encontrar a sessão solicitada. Verifique o link ou acesse o painel para ver as sessões disponíveis.
          </p>
        </div>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao painel
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default NotFoundState;
