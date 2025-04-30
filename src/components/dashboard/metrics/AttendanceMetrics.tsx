
import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TabsList, TabsTrigger, Tabs } from '@/components/ui/tabs';
import { CalendarCheck, TrendingUp, CheckCircle } from 'lucide-react';
import MetricsCard from './MetricsCard';
import { Progress } from '@/components/ui/progress';

// Sample data
const attendanceData = [
  { session: 'Sessão 1', date: '15/03', attendance: 42, total: 45 },
  { session: 'Sessão 2', date: '22/03', attendance: 38, total: 45 },
  { session: 'Sessão 3', date: '29/03', attendance: 40, total: 45 },
  { session: 'Sessão 4', date: '05/04', attendance: 35, total: 45 },
  { session: 'Sessão 5', date: '12/04', attendance: 32, total: 45 },
  { session: 'Sessão 6', date: '19/04', attendance: 36, total: 45 },
  { session: 'Sessão 7', date: '26/04', attendance: 30, total: 45 },
];

const sessionAttendanceRates = attendanceData.map(session => ({
  session: session.session,
  rate: Math.round((session.attendance / session.total) * 100)
}));

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border shadow-sm rounded-md">
        <p className="font-medium text-xs">{`${label}`}</p>
        <p className="text-xs text-repense-red">{`Presentes: ${payload[0].value}`}</p>
        {payload[1] && <p className="text-xs text-gray-500">{`Total: ${payload[1].value}`}</p>}
      </div>
    );
  }
  return null;
};

const AttendanceMetrics = () => {
  const [timeRange, setTimeRange] = useState('month');

  // Calculate overall attendance rate
  const totalAttendance = attendanceData.reduce((sum, session) => sum + session.attendance, 0);
  const totalStudents = attendanceData.reduce((sum, session) => sum + session.total, 0);
  const overallRate = Math.round((totalAttendance / totalStudents) * 100);

  return (
    <div className="space-y-6 animate-enter">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Estatísticas de Presença</h2>
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
          title="Taxa de Presença Geral" 
          description="Média de todas as sessões"
          icon={<CheckCircle size={20} />}
        >
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative flex items-center justify-center w-32 h-32">
              <svg className="w-32 h-32">
                <circle 
                  cx="64" 
                  cy="64" 
                  r="54" 
                  fill="none" 
                  stroke="#f1f1f1" 
                  strokeWidth="16"
                />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="54" 
                  fill="none" 
                  stroke="#CC2936" 
                  strokeWidth="16" 
                  strokeDasharray={`${2 * Math.PI * 54 * overallRate / 100} ${2 * Math.PI * 54 * (1 - overallRate / 100)}`} 
                  strokeDashoffset={2 * Math.PI * 54 * 0.25}
                  strokeLinecap="round"
                  transform="rotate(-90, 64, 64)"
                />
              </svg>
              <span className="absolute text-3xl font-bold">{overallRate}%</span>
            </div>
            <span className="text-sm text-muted-foreground mt-3">Taxa de presença média</span>
          </div>
        </MetricsCard>

        <MetricsCard 
          title="Presença por Sessão" 
          description="Número de alunos presentes por sessão"
          icon={<CalendarCheck size={20} />}
          className="md:col-span-2"
        >
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={attendanceData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="session" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="attendance" fill="#CC2936" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total" fill="#f1f1f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MetricsCard>

        <MetricsCard 
          title="Tendência de Presença" 
          description="Evolução da presença ao longo do tempo"
          icon={<TrendingUp size={20} />}
          className="col-span-2"
        >
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={attendanceData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#CC2936" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#CC2936" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#CC2936" 
                  fillOpacity={1} 
                  fill="url(#colorAttendance)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </MetricsCard>

        <MetricsCard 
          title="Taxa de Presença por Sessão" 
          description="Porcentagem de alunos presentes"
        >
          <div className="space-y-4 pt-2">
            {sessionAttendanceRates.map((session, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{session.session}</span>
                  <span className="font-medium">{session.rate}%</span>
                </div>
                <Progress value={session.rate} className="h-2" />
              </div>
            ))}
          </div>
        </MetricsCard>
      </div>
    </div>
  );
};

export default AttendanceMetrics;
