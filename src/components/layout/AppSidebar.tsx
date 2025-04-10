
import { 
  LayoutDashboard, 
  DollarSign, 
  Briefcase, 
  BarChart, 
  TrendingUp, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar";

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Income',
      path: '/income',
      icon: DollarSign,
    },
    {
      title: 'Projects',
      path: '/projects',
      icon: Briefcase,
    },
    {
      title: 'Analytics',
      path: '/analytics',
      icon: BarChart,
    },
    {
      title: 'Forecasting',
      path: '/forecasting',
      icon: TrendingUp,
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: Settings,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar>
      <SidebarContent className="py-6">
        <div className="px-5 mb-8">
          <h1 className="text-xl font-bold text-white flex items-center">
            <DollarSign className="h-6 w-6 text-money-primary mr-2" />
            Money Tracker
          </h1>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    className={isActive(item.path) ? "bg-sidebar-accent text-white" : ""}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="px-5 py-4">
        <button 
          onClick={signOut}
          className="flex items-center px-3 py-2 w-full rounded-md text-white hover:bg-sidebar-accent transition-colors"
        >
          <LogOut className="h-4 w-4 mr-3" />
          <span>Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
