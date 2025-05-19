import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Fondo circular */}
      <circle cx="16" cy="16" r="14" className="fill-primary" />
      
      {/* Gráfico de velas */}
      <path 
        d="M12 12H14V20H12V12Z" 
        className="fill-background" 
      />
      <path 
        d="M12 10H14V12H12V10Z" 
        className="fill-background" 
      />
      <path 
        d="M12 20H14V22H12V20Z" 
        className="fill-background" 
      />
      <path 
        d="M18 8H20V18H18V8Z" 
        className="fill-background" 
      />
      <path 
        d="M18 6H20V8H18V6Z" 
        className="fill-background" 
      />
      <path 
        d="M18 18H20V20H18V18Z" 
        className="fill-background" 
      />
      <path 
        d="M24 14H26V22H24V14Z" 
        className="fill-background" 
      />
      <path 
        d="M24 12H26V14H24V12Z" 
        className="fill-background" 
      />
      <path 
        d="M24 22H26V24H24V22Z" 
        className="fill-background" 
      />
    </svg>
    
    {/* Anillo exterior sutil */}
    <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
  </div>
);

export default Logo;
