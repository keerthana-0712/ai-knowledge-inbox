import React from 'react';

interface TuriumLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const TuriumLogo: React.FC<TuriumLogoProps> = ({
  className = '',
  size = 28,
  glow = false,
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {glow && (
        <div 
          className="absolute inset-0 rounded-full bg-[#6100ff]/20 blur-md -z-10 animate-pulse"
          style={{ width: size * 1.4, height: size * 1.4 }}
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          {/* Top illuminated facet */}
          <linearGradient id="facetTop" x1="4" y1="2.5" x2="28" y2="16.35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ede5fb" />
            <stop offset="50%" stopColor="#c7b3ef" />
            <stop offset="100%" stopColor="#9d66ff" />
          </linearGradient>

          {/* Left royal purple facet */}
          <linearGradient id="facetLeft" x1="4" y1="9.4" x2="16" y2="30.2" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#791aff" />
            <stop offset="60%" stopColor="#6100ff" />
            <stop offset="100%" stopColor="#4300b0" />
          </linearGradient>

          {/* Right deep indigo facet */}
          <linearGradient id="facetRight" x1="28" y1="9.4" x2="16" y2="30.2" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5500e0" />
            <stop offset="50%" stopColor="#3d009e" />
            <stop offset="100%" stopColor="#220059" />
          </linearGradient>

          {/* Central floating core gradient */}
          <linearGradient id="innerCore" x1="11" y1="11" x2="21" y2="17.5" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#ede5fb" />
          </linearGradient>

          {/* Core glow */}
          <radialGradient id="centerGlow" cx="16" cy="16" r="3.5" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#c49eff" />
            <stop offset="100%" stopColor="#6100ff" stopOpacity="0" />
          </radialGradient>

          {/* Soft shadow for depth */}
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#000000" floodOpacity="0.12" />
          </filter>
        </defs>

        <g filter="url(#softShadow)">
          {/* Top Facet */}
          <path
            d="M16 2.5L28 9.428L16 16.357L4 9.428Z"
            fill="url(#facetTop)"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="0.6"
            strokeLinejoin="round"
          />

          {/* Left Facet */}
          <path
            d="M4 9.428L16 16.357V30.214L4 23.285Z"
            fill="url(#facetLeft)"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />

          {/* Right Facet */}
          <path
            d="M16 16.357L28 9.428V23.285L16 30.214Z"
            fill="url(#facetRight)"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />

          {/* Specular Inner Spine Highlight */}
          <line
            x1="16"
            y1="16.357"
            x2="16"
            y2="30.214"
            stroke="rgba(255, 255, 255, 0.35)"
            strokeWidth="0.75"
          />

          {/* Floating Neural Hex-Prism Core */}
          <path
            d="M16 11.2L21.2 14.2L16 17.2L10.8 14.2Z"
            fill="url(#innerCore)"
            stroke="#6100ff"
            strokeWidth="0.5"
          />

          {/* Central Neural Nexus Ray */}
          <line
            x1="16"
            y1="17.2"
            x2="16"
            y2="24.5"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />

          {/* Luminous Nucleus Point */}
          <circle cx="16" cy="14.2" r="2.4" fill="url(#centerGlow)" />
          <circle cx="16" cy="14.2" r="1" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
};
