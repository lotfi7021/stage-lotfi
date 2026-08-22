import React from 'react';

const Logo = ({ className = "", width = "120", height = "60" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 400 200" 
        xmlns="http://www.w3.org/2000/svg"
        className="object-contain"
      >
        {/* Courbe bleue principale */}
        <path 
          d="M 120 50 Q 180 30 220 80 Q 240 110 220 140 Q 180 170 120 150" 
          fill="none" 
          stroke="#1e5099" 
          strokeWidth="8" 
        />
        
        {/* Forme rouge en zigzag */}
        <path 
          d="M 200 70 L 210 80 L 200 90 L 210 100 L 200 110 L 210 120 L 200 130" 
          fill="none" 
          stroke="#e31e24" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* Texte principal */}
        <text 
          x="200" 
          y="170" 
          textAnchor="middle" 
          fontFamily="Arial, sans-serif" 
          fontSize="20" 
          fontWeight="bold" 
          fill="#1e5099"
        >
          Société Tunisienne
        </text>
        
        {/* Sous-texte */}
        <text 
          x="200" 
          y="190" 
          textAnchor="middle" 
          fontFamily="Arial, sans-serif" 
          fontSize="16" 
          fontWeight="bold" 
          fill="#1e5099"
        >
          de l'Electricité et du Gaz
        </text>
      </svg>
    </div>
  );
};

export default Logo;