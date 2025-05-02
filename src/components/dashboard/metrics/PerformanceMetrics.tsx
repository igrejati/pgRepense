import React, { useState } from 'react';
import { TabsList, TabsTrigger, Tabs } from '@/components/ui/tabs';
import { Award, Star, TrendingUp } from 'lucide-react';
import MetricsCard from './MetricsCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';

// Updated sample data with new course names
const topCourses = [
  { id: 1, course: 'PG Repense o Evangelho (Presencial)', attendees: 42, enrolled: 45, rate: 93 },
  { id: 2, course: 'PG Repense a Igreja (Online)', attendees: 35, enrolled: 40, rate: 88 },
  { id: 3, course: 'PG Repense a Espiritualidade (Presencial)', attendees: 28, enrolled: 35, rate: 80 },
  { id: 4, course: 'PG Repense o Evangelho (Online)', attendees: 23, enrolled: 30, rate: 77 },
  { id: 5, course: 'PG Repense a Igreja (Presencial)', attendees: 15, enrolled: 20, rate: 75 },
];

const topSessions = [
  { id: 1, course: 'PG Repense o Evangelho (Presencial)', session: 'Sessão 1', date: '15/03', attendees: 42, potential: 45, rate: 93 },
  { id: 2, course: 'PG Repense a Igreja (Online)', session: 'Sessão 2', date: '22/03', attendees: 38, potential: 40, rate: 95 },
  { id: 3, course: 'PG Repense a Espiritualidade (Presencial)', session: 'Sessão 1', date: '15/03', attendees: 32, potential: 35, rate: 91 },
  { id: 4, course: 'PG Repense o Evangelho (Online)', session: 'Sessão 3', date: '29/03', attendees: 27, potential: 30, rate: 90 },
  { id: 5, course: 'PG Repense a Igreja (Presencial)', session: 'Sessão 1', date: '15/03', attendees: 37, potential: 40, rate: 93 },
];

const enrollmentTrends = [
  { week: '01/03', attendance: 85 },
  { week: '08/03', attendance: 82 },
  { week: '15/03', attendance: 88 },
  { week: '22/03', attendance: 90 },
  { week: '29/03', attendance: 85 },
  { week: '05/04', attendance: 83 },
  { week: '12/04', attendance: 80 },
  { week: '19/04', attendance: 78 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border shadow-sm rounded-md">
        <p className="font-medium text-xs">{`${label}`}</p>
        <p className="text-xs text-repense-red">{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const PerformanceMetrics = () => {
  const [timeRange, setTimeRange] = useState('month');

  return (
    <div className="space-y-6 animate-enter">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Métricas de Desempenho</h2>
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
          title="Cursos com Melhor Desempenho" 
          description="Baseado na taxa de presença"
          icon={<Award size={20} />}
          className="col-span-1 row-span-2"
        >
          <div className="space-y-4">
            {topCourses.map((course, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${i === 0 ? 'bg-yellow-100 text-yellow-600' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-muted text-muted-foreground'}`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{course.course}</p>
                  <p className="text-xs text-muted-foreground">{course.attendees} de {course.enrolled} alunos</p>
                </div>
                <div className="flex items-center">
                  <Badge variant={i < 3 ? "default" : "outline"} className={i < 3 ? "bg-repense-red" : ""}>
                    {course.rate}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </MetricsCard>

        <MetricsCard 
          title="Sessões Mais Frequentadas" 
          description="Sessões com maior número de participantes"
          className="col-span-2"
        >
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curso</TableHead>
                  <TableHead>Sessão</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Presentes</TableHead>
                  <TableHead className="text-right">Taxa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.course}</TableCell>
                    <TableCell>{session.session}</TableCell>
                    <TableCell>{session.date}</TableCell>
                    <TableCell className="text-right">{session.attendees}/{session.potential}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="bg-repense-red text-white">
                        {session.rate}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </MetricsCard>

        <MetricsCard 
          title="Tendência de Engajamento" 
          description="Evolução da taxa de presença"
          icon={<TrendingUp size={20} />}
          className="col-span-2"
        >
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={enrollmentTrends}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickLine={false} 
                  axisLine={false}
                  domain={[70, 100]}
                  tickFormatter={(tick) => `${tick}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  name="Taxa de presença"
                  stroke="#CC2936" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </MetricsCard>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
