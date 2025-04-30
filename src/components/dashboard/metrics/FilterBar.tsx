
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, FilterIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent
} from '@/components/ui/card';

type FilterBarProps = {
  onCourseChange?: (course: string) => void;
  onCategoryChange?: (category: string) => void;
  onDateRangeChange?: (range: { from: Date, to: Date }) => void;
  courses?: { id: string; name: string }[];
  categories?: string[];
};

const FilterBar: React.FC<FilterBarProps> = ({
  onCourseChange,
  onCategoryChange,
  onDateRangeChange,
  courses = [],
  categories = [],
}) => {
  const [date, setDate] = React.useState<{
    from: Date;
    to: Date | undefined;
  }>({
    from: new Date(),
    to: undefined,
  });

  // Handle date selection
  const handleDateSelect = (selectedDate: any) => {
    const newDate = {
      from: selectedDate.from || date.from,
      to: selectedDate.to,
    };
    setDate(newDate);
    
    if (onDateRangeChange && newDate.from && newDate.to) {
      onDateRangeChange(newDate as { from: Date, to: Date });
    }
  };

  return (
    <Card className="mb-6 bg-white border border-gray-200">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <FilterIcon size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium">Filtros</span>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            {courses.length > 0 && (
              <Select onValueChange={onCourseChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos os cursos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os cursos</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {categories.length > 0 && (
              <Select onValueChange={onCategoryChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                        {format(date.to, "dd/MM/yyyy", { locale: ptBR })}
                      </>
                    ) : (
                      format(date.from, "dd/MM/yyyy", { locale: ptBR })
                    )
                  ) : (
                    <span>Selecione um período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date.from}
                  selected={date}
                  onSelect={handleDateSelect}
                  numberOfMonths={2}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterBar;
