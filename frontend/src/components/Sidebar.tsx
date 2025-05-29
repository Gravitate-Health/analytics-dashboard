import React from 'react';
import logo from '../assets/gh-lens.png';

const Sidebar: React.FC = () => {
  const menuItems = [
    {
      name: 'Home',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      active: false
    },
    {
      name: 'Dashboard',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      active: true
    },
    {
      name: 'Medication Details',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      active: false
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 z-30">
      {/* Logo area */}
      <div className="h-20 flex items-center px-6 border-b border-gray-50">
        <div className="flex items-center space-x-3">
            <img src={logo} alt="Gravitate Health Logo" className="h-10" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">Gravitate Health</h1>
            <p className="text-xs text-gray-500 -mt-1"></p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 px-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  item.active
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border-l-4 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`${item.active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} transition-colors duration-200`}>
                  {item.icon}
                </span>
                <span className="ml-3 font-medium">
                  {item.name}
                </span>
                {item.active && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Quick stats */}
      <div className="mt-8 mx-4 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</p>
            <p className="text-sm font-bold text-gray-900 mt-1">All Systems</p>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-600">Active</span>
          </div>
        </div>
      </div>

      {/* User info 
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">administrator@gravitate.health</p>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      */}
    </aside>
  );
};

export default Sidebar;