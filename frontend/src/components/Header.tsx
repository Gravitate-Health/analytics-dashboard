import React from 'react';
import { HeaderProps } from '../utils/types';

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        {/* Title */}
        <div><h1 className='text-2xl font-bold text-navy'>Dashboard</h1></div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500">Period time:</span>
              <span className="font-medium text-gray-700">Last 30 days</span>
            </div>
          </div>
          {/* Hamburger */}
          <button onClick={toggleSidebar} className='text-gray-500 focus:outline-none' aria-label='Open sidebar'>
            <svg className='w-6 h-6' fill='none' stroke="currentColor" viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
