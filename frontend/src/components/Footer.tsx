import React from 'react';
import euFlag from '../assets/footer/EU_flag_yellow_.jpg';
import imiLogo from '../assets/footer/IMI-Logo2014-HorizPos.jpg';
import efpiaLogo from '../assets/footer/EFPIA_Logo_Def_Solo.jpg';
import datapharmLogo from '../assets/footer/Datapharm-icon-words-300x300-square-1-2.jpg';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      {/* Sezione loghi */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          <div className="flex items-center justify-center">
            <img 
              src={euFlag} 
              alt="EU Flag" 
              className="h-12 md:h-16 w-auto object-contain"
            />
          </div>
          <div className="flex items-center justify-center">
            <a 
              href="http://www.imi.europa.eu/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src={imiLogo} 
                alt="IMI Logo" 
                className="h-12 md:h-16 w-auto object-contain"
              />
            </a>
          </div>
          <div className="flex items-center justify-center">
            <a 
              href="https://www.efpia.eu/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src={efpiaLogo} 
                alt="EFPIA Logo" 
                className="h-12 md:h-16 w-auto object-contain"
              />
            </a>
          </div>
          <div className="flex items-center justify-center">
            <a 
              href="https://www.datapharm.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src={datapharmLogo} 
                alt="Datapharm Logo" 
                className="h-12 md:h-16 w-auto object-contain"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Sezione testo */}
      <div className="container mx-auto px-4 pb-8">
        <div className="text-gray-600 italic text-sm md:text-base space-y-4">
          <p>
            <strong>Supported by a grant from IMI</strong>
            <br />
            This project has received funding from the Innovative Medicines Initiative 2 Joint Undertaking (JU) under grant agreement No 945334. The JU receives support from the European Union's Horizon 2020 research and innovation programme, the European Federation of Pharmaceutical Industries and Associations [EFPIA], and Datapharm Limited. The total budget is 19.4M€ for a project duration of 60 months.
          </p>
          <p>
            <strong>Disclaimer:</strong>
            <br />
            Information on this website reflects Project owner's views and neither IMI nor the European Union, EFPIA, or or Datapharm Limited are liable for any use that may be made of the information contained herein.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
