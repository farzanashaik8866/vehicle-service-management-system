function Logo({ size = 48, showText = true, textColor = "currentColor" }) {
  return (
    <div
      className="d-flex align-items-center gap-2"
      style={{
        minWidth: 0,
      }}
    >
      {/* Circular Automotive Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Vehicle Service Management logo"
        role="img"
        style={{
          flexShrink: 0,
        }}
      >
        <defs>
          <linearGradient
            id="logoBlue"
            x1="15"
            y1="10"
            x2="85"
            y2="90"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#60A5FA" />

            <stop offset="0.45" stopColor="#2563EB" />

            <stop offset="1" stopColor="#1D4ED8" />
          </linearGradient>

          <linearGradient
            id="logoDark"
            x1="20"
            y1="20"
            x2="80"
            y2="80"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#334155" />

            <stop offset="1" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient
            id="logoSilver"
            x1="20"
            y1="15"
            x2="80"
            y2="85"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#FFFFFF" />

            <stop offset="0.5" stopColor="#E2E8F0" />

            <stop offset="1" stopColor="#94A3B8" />
          </linearGradient>
        </defs>

        {/* Outer blue circular ring */}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="url(#logoBlue)"
          strokeWidth="8"
        />

        {/* Outer highlight */}
        <path
          d="
            M20 72
            C12 60 10 46 15 34
            C20 21 32 12 45 9
          "
          fill="none"
          stroke="#93C5FD"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Inner dark circle */}
        <circle cx="50" cy="50" r="34" fill="url(#logoDark)" />

        {/* Inner blue ring */}
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
        />

        {/* Car body */}
        <path
          d="
            M27 52
            L31 39
            C32 35 36 32 41 32
            L59 32
            C64 32 68 35 69 39
            L73 52
            L73 63
            C73 66 71 68 68 68
            L32 68
            C29 68 27 66 27 63
            Z
          "
          fill="url(#logoSilver)"
        />

        {/* Car windshield */}
        <path
          d="
            M36 40
            C37 36 39 35 43 35
            L57 35
            C61 35 63 36 64 40
            L66 46
            L34 46
            Z
          "
          fill="#2563EB"
        />

        {/* Windshield highlight */}
        <path
          d="
            M40 37
            L58 37
            C60 37 61 38 62 41
            L63 43
            L37 43
            L39 38
            Z
          "
          fill="#93C5FD"
          opacity="0.75"
        />

        {/* Center windshield divider */}
        <path d="M50 35 L50 45" stroke="#E0F2FE" strokeWidth="2" />

        {/* Headlights */}
        <rect x="30" y="49" width="9" height="5" rx="2" fill="#60A5FA" />

        <rect x="61" y="49" width="9" height="5" rx="2" fill="#60A5FA" />

        {/* Car front grille */}
        <path
          d="
            M42 56
            L58 56
            L61 61
            L39 61
            Z
          "
          fill="#0F172A"
        />

        <path
          d="M44 58 L56 58"
          stroke="#60A5FA"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Wheels */}
        <circle cx="36" cy="66" r="7" fill="#0F172A" />

        <circle cx="36" cy="66" r="3" fill="#CBD5E1" />

        <circle cx="64" cy="66" r="7" fill="#0F172A" />

        <circle cx="64" cy="66" r="3" fill="#CBD5E1" />

        {/* Wrench on right side */}
        <path
          d="
            M67 22
            C61 22 57 27 58 32
            L62 36
            L69 29
            L74 34
            L67 41
            L71 45
            C76 46 81 42 81 37
            C81 34 80 32 78 30
            L74 34
            L69 29
            L73 25
            C71 23 69 22 67 22
            Z
          "
          fill="url(#logoSilver)"
          opacity="0.98"
        />

        {/* Wrench handle */}
        <path
          d="
            M68 40
            L76 48
            L72 52
            L64 44
            Z
          "
          fill="#CBD5E1"
        />

        {/* Bottom blue accent */}
        <path
          d="
            M25 77
            C34 84 42 87 51 87
            C61 87 70 83 77 76
          "
          fill="none"
          stroke="url(#logoBlue)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Small blue highlight */}
        <circle cx="22" cy="70" r="3" fill="#60A5FA" />
      </svg>

      {/* Brand text */}
      {showText && (
        <span
          className="fw-bold"
          style={{
            color: textColor,
            fontSize: "1.05rem",
            lineHeight: "1.2",
            whiteSpace: "nowrap",
          }}
        >
          Vehicle Service Management
        </span>
      )}
    </div>
  );
}

export default Logo;
