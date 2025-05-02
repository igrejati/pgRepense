import React, { useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import EnrollmentMetrics from '@/components/dashboard/metrics/EnrollmentMetrics';
import AttendanceMetrics from '@/components/dashboard/metrics/AttendanceMetrics';
import PerformanceMetrics from '@/components/dashboard/metrics/PerformanceMetrics';
import FilterBar from '@/components/dashboard/metrics/FilterBar';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('enrollment');
  
  // Updated courses data with new course names
  const courses = [
    { id: '1', name: 'PG Repense o Evangelho (Presencial)' },
    { id: '2', name: 'PG Repense a Igreja (Online)' },
    { id: '3', name: 'PG Repense a Espiritualidade (Presencial)' },
    { id: '4', name: 'PG Repense o Evangelho (Online)' },
    { id: '5', name: 'PG Repense a Igreja (Presencial)' },
  ];
  
  const categories = [
    'Espiritualidade',
    'Igreja',
    'Evangelho',
  ];

  return (
    <DashboardLayout userRole="pastor" userName="Pastor Silva">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
          <p className="text-muted-foreground mt-1">
            Visão completa de cursos, alunos e métricas de desempenho.
          </p>
        </div>

        <FilterBar 
          courses={courses}
          categories={categories}
          onCourseChange={(course) => console.log('Course changed:', course)}
          onCategoryChange={(category) => console.log('Category changed:', category)}
          onDateRangeChange={(range) => console.log('Date range changed:', range)}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="border-b">
            <TabsList className="bg-transparent p-0 h-12">
              <TabsTrigger 
                value="enrollment" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-repense-red data-[state=active]:shadow-none rounded-none h-12 px-4"
              >
                Matrículas
              </TabsTrigger>
              <TabsTrigger 
                value="attendance" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-repense-red data-[state=active]:shadow-none rounded-none h-12 px-4"
              >
                Presença
              </TabsTrigger>
              <TabsTrigger 
                value="performance" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-repense-red data-[state=active]:shadow-none rounded-none h-12 px-4"
              >
                Desempenho
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="enrollment" className="mt-6 space-y-6">
            <EnrollmentMetrics />
          </TabsContent>
          
          <TabsContent value="attendance" className="mt-6 space-y-6">
            <AttendanceMetrics />
          </TabsContent>
          
          <TabsContent value="performance" className="mt-6 space-y-6">
            <PerformanceMetrics />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
