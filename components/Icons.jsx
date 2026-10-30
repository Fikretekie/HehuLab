// Small line icons used across the site (no emoji, so they look the same on every phone).

export const GamePad = (p) => (
  <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <rect x="2" y="7" width="20" height="11" rx="5" fill="currentColor" />
    <path d="M7 10v5M4.5 12.5h5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <circle cx="16" cy="11" r="1.5" fill="#FFFFFF" />
    <circle cx="18.5" cy="14" r="1.5" fill="#FFFFFF" />
  </svg>
);

export const Sheet = (p) => (
  <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <rect x="5" y="3" width="14" height="18" rx="2" fill="currentColor" />
    <path d="M8 8h8M8 12h8M8 16h5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Moon = (p) => (
  <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path d="M20 15A8 8 0 0 1 9 4a8 8 0 1 0 11 11z" fill="currentColor" />
  </svg>
);

export const Play = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path d="M8 5v14l11-7z" fill="currentColor" />
  </svg>
);

export const Star = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path d="M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21.1l1.4-7L2 9.3l7-.8z" fill="#FFC93C" stroke="#102542" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export const Check = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path d="M5 12l4 4 10-10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
