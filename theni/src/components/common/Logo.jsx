import React from 'react';
import logoImage from '../../assets/images/images.jpg';

const Logo = ({ className = "", width = "120", height = "60" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoImage} 
        alt="STEG - Société Tunisienne de l'Électricité et du Gaz" 
        width={width} 
        height={height} 
        className="object-contain"
      />
    </div>
  );
};

export default Logo;