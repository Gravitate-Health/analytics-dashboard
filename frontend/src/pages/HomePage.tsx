import React from 'react';

import gravitateLogo from '../assets/gravitate-logo.png';

const HomePage: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-hero-bg text-center p-4">
      <img src={gravitateLogo} className='object-cover mb-8'></img>
      <div>
        <h1 className='text-white font-semibold uppercase tracking-widest mb-8 text-3xl'>A DIGITAL HEALTH INFORMATION JOURNEY</h1>
        <p className='text-gray-300 max-w-2xl italic text-2xl'>
          "Empowering and equipping Europeans with health information for active personal health management and adherence to treatment"
        </p>
      </div>
    </div>
  );
};
export default HomePage;