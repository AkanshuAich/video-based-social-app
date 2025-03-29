import React, { useState, ReactNode } from 'react';
import Sidebar from './Sidebar';
import MobileNavBar from './MobileNavBar';
import HeaderBar from './HeaderBar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex flex-col md:flex-row h-screen max-h-screen overflow-hidden">
      {/* Sidebar - Hidden on mobile */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background flex flex-col">
        <div className="flex-1">
          {/* Header Bar */}
          <HeaderBar toggleSidebar={toggleSidebar} />
          
          {/* Page Content */}
          <div className="flex-1 pb-24 md:pb-0">
            {children}
          </div>
        </div>
        
        {/* Mobile Navigation Bar */}
        <MobileNavBar />
      </main>
    </div>
  );
};

export default MainLayout;
