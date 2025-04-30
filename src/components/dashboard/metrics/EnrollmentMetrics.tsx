
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/components/ui/tabs';
import { Users, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import MetricsCard from './MetricsCard';

// Sample data
const enrollmentData = [
  { course: 'Discipulado', students: 42 },
  { course: 'Evangelismo', students: 35 },
  { course: 'Liderança', students: 28 },
  { course: 'Espiritualidade', students: 23 },
  { course: 'Família', students: 15 },
];

const enrollmentTrends = [
  { week: '01/03', enrollments: 8 },
  { week: '08/03', enrollments: 12 },
  { week: '15/03', enrollments: 6 },
  { week: '22/03', enrollments: 14 },
  { week: '29/03', enrollments: 10 },
  { week: '05/04', enrollments: 15 },
  { week: '12/04', enrollments: 20 },
  { week: '19/04', enrollments: 18 },
];

const categoryDistribution = [
  { name: 'Espiritualidade', value: 45, color: '#CC2936' },
  { name: 'Igreja', value: 30, color: '#F59E0B' },
  { name: 'Evangelho', value: 25, color: '#3B82F6' },
  { name: 'Família', value: 15, color: '#10B981' },
  { name: 'Liderança', value: 20, color: '#8B5CF6' },
];

const COLORS = ['#CC2936', '#F59E0B', '#3B82F6', '#10B981', '#8B5CF6'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border shadow-sm rounded-md">
        <p className="font-medium text-xs">{`${label}`}</p>
        <p className="text-xs text-repense-red">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const EnrollmentMetrics = () => {
  const [timeRange, setTimeRange] = useState('month');

  // Total enrollment calculation
  const totalStudents = enrollmentData.reduce((sum, course) => sum + course.students, 0);

  return (
    <div className="space-y-6 animate-enter">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Estatísticas de Matrículas</h2>
        <Tabs 
          defaultValue="month" 
          className="w-auto"
          onValueChange={setTimeRange}
        >
          <TabsList className="grid grid-cols-3 w-[200px]">
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="month">Mês</TabsTrigger>
            <TabsTrigger value="year">Ano</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricsCard 
          title="Total de Alunos" 
          description="Alunos matriculados em todos os cursos"
          icon={<Users size={20} />}
        >
          <div className="flex flex-col items-center justify-center py-6">
            <span className="text-5xl font-bold text-repense-red">{totalStudents}</span>
            <span className="text-sm text-muted-foreground mt-1">alunos ativos</span>
          </div>
        </MetricsCard>

        <MetricsCard 
          title="Alunos por Curso" 
          description="Distribuição de matrículas"
          icon={<BarChart3 size={20} />}
          className="md:col-span-2"
        >
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={enrollmentData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="course" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="students" fill="#CC2936" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MetricsCard>

        <MetricsCard 
          title="Tendência de Matrículas" 
          description="Evolução das matrículas ao longo do tempo"
          className="col-span-2"
        >
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={enrollmentTrends}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="enrollments" fill="#CC2936" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MetricsCard>

        <MetricsCard 
          title="Distribuição por Categoria" 
          description="Alunos por categoria de curso"
          icon={<PieChartIcon size={20} />}
        >
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </MetricsCard>
      </div>
    </div>
  );
};

export default EnrollmentMetrics;
