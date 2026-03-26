import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { ENABLE_LOGIN } from '../utils/constants';
import gravitateLogo from '../assets/gravitate-logo.png';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Rimuoviamo il redirect automatico per permettere l'accesso alla homepage anche quando loggati

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(username, password);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError(t('homePage.loginError'));
      setPassword('');
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col items-center justify-center bg-gravitate-hero text-center p-4">
        <div className="max-w-4xl w-full space-y-6">
          <img src={gravitateLogo} className='object-cover mx-auto mb-6 max-w-[250px] md:max-w-[320px]'></img>
          <h1 className='text-white font-normal uppercase tracking-widest mb-4 text-2xl md:text-3xl'>{t('homePage.title')}</h1>
          <p className='font-light text-gray-300 max-w-[50rem] mx-auto italic text-lg md:text-xl mb-8'>{t('homePage.subtitle')}</p>
          
          {ENABLE_LOGIN && !isAuthenticated && (
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 md:p-8 w-full max-w-md mx-auto border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-left text-white text-sm font-medium mb-2">
                  {t('homePage.username')}
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('homePage.usernamePlaceholder')}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-left text-white text-sm font-medium mb-2">
                  {t('homePage.password')}
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('homePage.passwordPlaceholder')}
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-400 text-sm bg-red-900/30 border border-red-500/50 rounded-md p-2">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
              >
                {t('homePage.loginButton')}
              </button>
            </form>
          </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};
export default HomePage;