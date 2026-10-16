import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64">
        <main className="pt-16 bg-background w-full px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
