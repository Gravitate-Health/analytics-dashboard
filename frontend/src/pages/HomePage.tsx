import React from 'react';

import { useTranslation } from 'react-i18next';

import gravitateLogo from '../assets/gravitate-logo.png';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="h-full flex flex-col items-center justify-center bg-hero-bg text-center p-4">
      <img src={gravitateLogo} className='object-cover mb-8'></img>
      <h1 className='text-white font-normal uppercase tracking-widest mb-12 text-3xl'>{t('homePage.title')}</h1>
      <p className='font-light text-gray-300 max-w-[50rem] italic text-2xl'>{t('homePage.subtitle')}</p>
    </div>
  );
};
export default HomePage;