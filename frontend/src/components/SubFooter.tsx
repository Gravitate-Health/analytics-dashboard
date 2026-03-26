import React from 'react';

const SubFooter: React.FC = () => {
  return (
    <div className="bg-gray-800 text-gray-300 py-4">
      <div className="container mx-auto px-4 text-center text-sm">
        © {new Date().getFullYear()} Gravitate Health. All rights reserved.
      </div>
    </div>
  );
};

export default SubFooter;
