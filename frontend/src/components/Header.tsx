import React from 'react';

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import gravitateLogo from '../assets/gravitate-logo-w.png';
import { HeaderProps } from '../utils/types';

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { t } = useTranslation();

  return (
    <header className="bg-hero-bg">
      <div className="mx-12 py-6 flex items-center justify-between">
        <div className="flex-1 flex justify-start">
          <Link to="/">
            <img src={gravitateLogo} alt="Gravitate Health logo" className="h-10" />
          </Link>
        </div>
        <div className="flex-none">
          <h1 className="text-2xl font-bold text-white whitespace-nowrap">  
            {t('header.title')}
          </h1>
        </div>
        <div className="flex-1 flex justify-end">
          <button onClick={toggleSidebar} className="text-white focus:outline-none" aria-label="Open sidebar">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
