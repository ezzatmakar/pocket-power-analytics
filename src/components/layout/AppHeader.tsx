
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Search, User } from 'lucide-react';

const AppHeader = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-white">
      <div className="flex items-center">
        <SidebarTrigger className="mr-4" />
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 rounded-md bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-money-primary focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-slate-100">
          <Bell className="h-5 w-5 text-slate-600" />
        </button>
        <div className="flex items-center">
          <span className="mr-2 font-medium hidden md:block">{user?.name || 'User'}</span>
          <div className="h-8 w-8 bg-money-primary text-white rounded-full flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
