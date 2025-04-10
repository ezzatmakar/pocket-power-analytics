
import { useEffect } from 'react';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import { SidebarProvider } from "@/components/ui/sidebar";
import RLSDebugger from '@/components/debug/RLSDebugger';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  // Update the document title
  useEffect(() => {
    document.title = 'Money Tracker';
  }, []);

  // Check if we're in development mode
  const isDev = import.meta.env.DEV;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6 overflow-auto bg-money-bg">
            {children}
          </main>
        </div>
        
        {/* Show RLS debugger only in development mode */}
        <RLSDebugger visible={isDev} />
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
