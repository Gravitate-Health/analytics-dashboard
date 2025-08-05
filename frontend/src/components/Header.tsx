import React from 'react';

import { Link } from 'react-router-dom';

import gravitateLogo from '../assets/gravitate-logo.png';
import { HeaderProps } from '../utils/types';

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-hero-bg">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className='flex items-center space-x-4'>
          <Link to="/"><img src={gravitateLogo} alt="Gravitate Health logo" className='h-10'></img></Link>
          <h1 className='text-2xl font-bold text-white'>GH-Dash</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Hamburger */}
          <button onClick={toggleSidebar} className='text-white focus:outline-none' aria-label='Open sidebar'>
            <svg className='w-8 h-8' fill='none' stroke="currentColor" viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
