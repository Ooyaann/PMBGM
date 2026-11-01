export function IlustrasiMasuk() {
  return (
    <div className="relative mx-auto my-6 flex items-center justify-center w-full max-w-[280px] h-[190px] select-none pointer-events-none">
      <svg
        viewBox="0 0 320 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg"
      >
        {/* Isometric Grid Guidelines */}
        <g stroke="currentColor" strokeOpacity="0.12" strokeDasharray="3 3">
          <line x1="40" y1="170" x2="40" y2="90" />
          <line x1="80" y1="190" x2="80" y2="70" />
          <line x1="120" y1="210" x2="120" y2="50" />
          <line x1="160" y1="215" x2="160" y2="35" />
          <line x1="200" y1="210" x2="200" y2="50" />
          <line x1="240" y1="190" x2="240" y2="70" />
          <line x1="280" y1="170" x2="280" y2="90" />
        </g>

        {/* Ambient Glow */}
        <ellipse cx="160" cy="155" rx="85" ry="32" fill="white" fillOpacity="0.08" />

        {/* Isometric Base Pedestal */}
        {/* Top Face */}
        <path
          d="M160 115 L235 152 L160 189 L85 152 Z"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="white"
          strokeWidth="1.8"
        />
        {/* Left Side Face */}
        <path
          d="M85 152 L160 189 L160 205 L85 168 Z"
          fill="currentColor"
          fillOpacity="0.28"
          stroke="white"
          strokeWidth="1.8"
        />
        {/* Right Side Face */}
        <path
          d="M160 189 L235 152 L235 168 L160 205 Z"
          fill="currentColor"
          fillOpacity="0.22"
          stroke="white"
          strokeWidth="1.8"
        />

        {/* Inner Platter Rim */}
        <path
          d="M160 126 L215 152 L160 178 L105 152 Z"
          fill="none"
          stroke="white"
          strokeOpacity="0.4"
          strokeWidth="1.2"
        />

        {/* Elevated Cylinder / Ompreng Hub */}
        {/* Cylinder Body */}
        <path
          d="M130 92 C130 102 143 110 160 110 C177 110 190 102 190 92 L190 128 C190 138 177 146 160 146 C143 146 130 138 130 128 Z"
          fill="currentColor"
          fillOpacity="0.32"
          stroke="white"
          strokeWidth="1.8"
        />
        {/* Cylinder Bottom Lip */}
        <path
          d="M130 128 C130 138 143 146 160 146 C177 146 190 138 190 128"
          stroke="white"
          strokeWidth="1.8"
          fill="none"
        />
        {/* Cylinder Top Rim */}
        <ellipse
          cx="160"
          cy="92"
          rx="30"
          ry="15"
          fill="currentColor"
          fillOpacity="0.25"
          stroke="white"
          strokeWidth="1.8"
        />
        {/* Cylinder Inner Hole */}
        <ellipse
          cx="160"
          cy="92"
          rx="18"
          ry="9"
          fill="currentColor"
          fillOpacity="0.4"
          stroke="white"
          strokeWidth="1.5"
        />

        {/* Floating Vertical Axis Line */}
        <line
          x1="160"
          y1="40"
          x2="160"
          y2="76"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />

        {/* Accent Floating Spheres */}
        <circle cx="75" cy="115" r="4.5" fill="#34d399" />
        <circle cx="245" cy="108" r="5" fill="#fbbf24" />
        <circle cx="260" cy="155" r="3.5" fill="#38bdf8" />
        <circle cx="160" cy="36" r="3" fill="white" />
      </svg>
    </div>
  );
}
