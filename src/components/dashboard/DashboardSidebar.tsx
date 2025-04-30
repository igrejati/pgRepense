
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart2, Users, Book, BookOpen, Calendar, Settings, 
  User, ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type SidebarItem = {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
};

type SidebarProps = {
  userRole?: 'pastor' | 'leader';
};

const DashboardSidebar = ({ userRole = 'leader' }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  const isPastor = userRole === 'pastor';

  const sidebarItems: SidebarItem[] = [
    {
      icon: BarChart2,
      label: 'Dashboard',
      href: isPastor ? '/admin' : '/dashboard',
      active: location.pathname === (isPastor ? '/admin' : '/dashboard'),
    },
    {
      icon: Book,
      label: 'Cursos',
      href: '/courses',
      active: location.pathname === '/courses',
    },
    {
      icon: Calendar,
      label: 'Sessões',
      href: '/sessions',
      active: location.pathname === '/sessions',
    },
    {
      icon: Users,
      label: 'Alunos',
      href: '/students',
      active: location.pathname === '/students',
    }
  ];

  // Additional items for pastor role
  if (isPastor) {
    sidebarItems.push(
      {
        icon: User,
        label: 'Líderes',
        href: '/leaders',
        active: location.pathname === '/leaders',
      },
      {
        icon: Settings,
        label: 'Configurações',
        href: '/settings',
        active: location.pathname === '/settings',
      }
    );
  }

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  return (
    <aside 
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="p-4 border-b border-gray-200 flex justify-center items-center">
        {!collapsed ? (
          <img 
            src="/repense-logo.png" 
            alt="Repense Logo" 
            className="h-8"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23CC2936" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpath d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"%3E%3C/path%3E%3C/svg%3E';
            }}
          />
        ) : (
          <BookOpen size={24} className="text-repense-red" />
        )}
      </div>

      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "w-full justify-start mb-1",
                item.active ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
                collapsed ? "px-2" : "px-3"
              )}
              onClick={() => handleNavigation(item.href)}
            >
              <item.icon size={20} className={collapsed ? "" : "mr-3"} />
              {!collapsed && <span>{item.label}</span>}
            </Button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full flex items-center justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <>
              <ChevronLeft size={18} className="mr-2" />
              <span>Recolher</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
