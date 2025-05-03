
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type DashboardHeaderProps = {
  userName?: string;
  userRole?: string;
};

const DashboardHeader = ({
  userName = 'João Silva',
  userRole = 'Líder',
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const [notifications] = useState(2); // Mock notification count

  // Simplified user display name
  const displayName = userName;

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-repense-black">Repense Course Compass</h1>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="relative">
          <Bell size={20} />
          {notifications > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-repense-red rounded-full text-[10px] text-white flex items-center justify-center">
              {notifications}
            </span>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-repense-red flex items-center justify-center text-white">
                <User size={16} />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">{userRole}</p>
              </div>
              <ChevronDown size={16} className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm">
              <div className="font-semibold">{displayName}</div>
              <div className="text-xs text-muted-foreground">{userRole}</div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Agenda</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
