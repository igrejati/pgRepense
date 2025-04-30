
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/components/ui/tabs';
import { Users, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import MetricsCard from './MetricsCard';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

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

const COLORS = ['#CC2936', '#F59E0B', '#3B82F6', '#10B981', '#8B5CF6'];

const EnrollmentMetrics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [enrollmentData, setEnrollmentData] = useState<any[]>([]);
  const [enrollmentTrends, setEnrollmentTrends] = useState<any[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<any[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch total students
        const { count: studentCount, error: countError } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true });
        
        if (countError) throw countError;
        setTotalStudents(studentCount || 0);
        
        // Fetch enrollment by course
        const { data: courses, error: coursesError } = await supabase
          .from('courses')
          .select('id, title, enrolled_count, capacity')
          .eq('is_active', true)
          .order('enrolled_count', { ascending: false })
          .limit(5);
        
        if (coursesError) throw coursesError;
        
        const formattedCourses = courses.map(course => ({
          course: course.title || 'Sem título',
          students: course.enrolled_count || 0
        }));
        
        setEnrollmentData(formattedCourses);
        
        // Calculate category distribution
        const { data: courseTags, error: tagsError } = await supabase
          .from('courses')
          .select('course_tag, enrolled_count');
        
        if (tagsError) throw tagsError;
        
        const tagCounts: Record<string, number> = {};
        
        courseTags.forEach(course => {
          const tag = course.course_tag || 'Sem categoria';
          tagCounts[tag] = (tagCounts[tag] || 0) + (course.enrolled_count || 0);
        });
        
        const categoryData = Object.entries(tagCounts).map(([name, value], index) => ({
          name,
          value,
          color: COLORS[index % COLORS.length]
        }));
        
        setCategoryDistribution(categoryData);
        
        // Calculate enrollment trends over time
        // This is a simplified version since we don't have time-series data
        // In a real app, this would use student_courses.registration_date
        
        const { data: studentCourses, error: studentCoursesError } = await supabase
          .from('student_courses')
          .select('registration_date')
          .order('registration_date', { ascending: true });
        
        if (studentCoursesError) throw studentCoursesError;
        
        const trendsMap: Record<string, number> = {};
        
        // Group registrations by week
        studentCourses.forEach(record => {
          if (!record.registration_date) return;
          
          const date = new Date(record.registration_date);
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          
          const weekKey = `${weekStart.getDate().toString().padStart(2, '0')}/${(weekStart.getMonth() + 1).toString().padStart(2, '0')}`;
          trendsMap[weekKey] = (trendsMap[weekKey] || 0) + 1;
        });
        
        const trendData = Object.entries(trendsMap)
          .map(([week, enrollments]) => ({ week, enrollments }))
          .slice(-8); // Last 8 weeks
        
        setEnrollmentTrends(trendData);
      } catch (error) {
        console.error('Error fetching enrollment metrics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="space-y-6 animate-enter">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px] md:col-span-2" />
          <Skeleton className="h-[300px] col-span-2" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    );
  }

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
            {enrollmentData.length > 0 ? (
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
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Nenhum dado de matrícula disponível</p>
              </div>
            )}
          </div>
        </MetricsCard>

        <MetricsCard 
          title="Tendência de Matrículas" 
          description="Evolução das matrículas ao longo do tempo"
          className="col-span-2"
        >
          <div className="h-[250px] w-full">
            {enrollmentTrends.length > 0 ? (
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
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Sem dados de tendência disponíveis</p>
              </div>
            )}
          </div>
        </MetricsCard>

        <MetricsCard 
          title="Distribuição por Categoria" 
          description="Alunos por categoria de curso"
          icon={<PieChartIcon size={20} />}
        >
          <div className="h-[250px] w-full">
            {categoryDistribution.length > 0 ? (
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
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Sem dados de categoria disponíveis</p>
              </div>
            )}
          </div>
        </MetricsCard>
      </div>
    </div>
  );
};

export default EnrollmentMetrics;
