import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Firebase Analytics Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Visualizzazione dati GA4 per app mobile</p>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500">Periodo:</span>
              <span className="font-medium text-gray-700">Ultimi 30 giorni</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
