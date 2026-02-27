import React from 'react';

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../contexts/AuthContext';
import { ENABLE_LOGIN } from '../utils/constants';
import gravitateLogo from '../assets/gravitate-logo-white.png';
import { HeaderProps } from '../utils/types';

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Mostra logout solo se il login è abilitato e l'utente è autenticato
  const showLogout = ENABLE_LOGIN && isAuthenticated;

  return (
    <header className="bg-gravitate-hero relative">
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="mx-12 py-6 flex items-center justify-between relative z-10">
        <div className="flex-1 flex justify-start">
          <Link to="/">
            <img src={gravitateLogo} alt="Gravitate Health logo" className="h-10" />
          </Link>
        </div>
        <div className="flex-none">
          {/* <h1 className="text-2xl font-bold text-white whitespace-nowrap">
            {t('header.title')}
          </h1> */}
        </div>
        <div className="flex-1 flex justify-end items-center gap-4">
          {showLogout && (
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-300 transition duration-200 px-4 py-2 rounded-md border border-white/30 hover:bg-white/10"
              aria-label="Logout"
            >
              {t('header.logout')}
            </button>
          )}
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
