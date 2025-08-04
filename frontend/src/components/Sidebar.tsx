import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import logo from '../assets/gh-lens.png';
import { SidebarProps } from '../utils/types';

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const menuItems = [
    {
      name: 'HOME',
      to: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'DASHBOARD',
      to: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: 'MEDICATIONS',
      to: '/medications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    }
  ];

  return (
    <aside
      className={`fixed right-0 top-0 h-full w-64 bg-sidebar-bg border-l border-gray-100 z-30 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Close button area */}
      <div className="h-20 flex items-center justify-start px-6">
        <button
          onClick={closeSidebar}
          className="text-white hover:text-gray-300"
          aria-label="Close sidebar"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-8 px-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                end //
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `font-sans group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive ? 'text-sidebar-accent' : 'text-sidebar-text hover:text-sidebar-accent'}`
                }
              >
                {({ isActive }) => (
                  <><span className="font-medium">{item.name}</span></>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;