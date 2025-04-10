
import { useEffect } from 'react';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  // Update the document title
  useEffect(() => {
    document.title = 'Money Tracker';
  }, []);

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
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
