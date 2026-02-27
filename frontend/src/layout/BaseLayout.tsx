import React, { useState } from 'react';

import { Outlet } from 'react-router-dom';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';


const BaseLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {setSidebarOpen(!isSidebarOpen)}

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={isSidebarOpen} closeSidebar={toggleSidebar}/>
      {isSidebarOpen && (
        <div onClick={toggleSidebar} className='fixed inset-0 bg-black opacity-50 z-20' aria-hidden="true"></div>
      )}
      <div className="flex flex-col h-screen flex-1 min-w-0">
        <Header toggleSidebar={toggleSidebar}/>
        <main className="flex-1 overflow-y-auto hide-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BaseLayout;