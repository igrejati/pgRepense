
import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Making userName optional to fix the type error
interface NotFoundStateProps {
  userName?: string;
}

const NotFoundState: React.FC<NotFoundStateProps> = ({ userName = "Líder" }) => {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout userRole="leader" userName={userName}>
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-semibold mb-4">Sessão não encontrada</h2>
        <p className="text-muted-foreground mb-4">A sessão solicitada não foi encontrada ou você não tem permissão para acessá-la.</p>
        <Button onClick={() => navigate('/dashboard')}>
          Voltar para o Dashboard
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default NotFoundState;
