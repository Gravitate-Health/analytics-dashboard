import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const BaseLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {setSidebarOpen(!isSidebarOpen)}

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={isSidebarOpen} closeSidebar={toggleSidebar}/>
      {isSidebarOpen && (
        <div onClick={toggleSidebar} className='fixed inset-0 bg-black opacity-50 z-20 lg:hidden' aria-hidden="true"></div>
      )}
      <div className="flex-1 lg:ml-64">
        <Header toggleSidebar={toggleSidebar}/>
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BaseLayout;