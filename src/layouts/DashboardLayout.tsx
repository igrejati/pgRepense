
import React, { ReactNode } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

type DashboardLayoutProps = {
  children: ReactNode;
  userRole?: 'pastor' | 'leader';
  userName?: string;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  userRole = 'leader',
  userName = 'João Silva'
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader userName={userName} userRole={userRole === 'pastor' ? 'Pastor' : 'Líder'} />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar userRole={userRole} />
        
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
