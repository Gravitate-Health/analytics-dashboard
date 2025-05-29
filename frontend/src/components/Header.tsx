import React from 'react';
import logo from '../assets/gh-lens.png';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* <img src={logo} alt="Gravitate Health Logo" className="h-10" /> */}
          <div>
            <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
            {/* <p className="text-sm text-gray-500 mt-1">Visualizing GA4 Data for Mobile Apps</p> */}
          </div>
        </div>
        <div className="hidden md:block">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">Period time:</span>
            <span className="font-medium text-gray-700">Last 30 days</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
