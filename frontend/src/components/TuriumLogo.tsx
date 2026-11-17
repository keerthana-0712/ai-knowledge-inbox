import React from 'react';

export const TuriumLogo: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 20,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Turium Interlocking Geometric Hex-Prism */}
      <path
        d="M16 3L26 8.77V20.31L16 26.08L6 20.31V8.77L16 3Z"
        stroke="#6100ff"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M16 3V14.54M26 20.31L16 14.54M6 20.31L16 14.54"
        stroke="#8b3dff"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="14.54" r="2.5" fill="#ffffff" />
    </svg>
  );
};
