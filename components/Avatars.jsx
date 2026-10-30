// The teachers. Rodas is a photo; the animal friends and Grandma are drawings.

export function Rodas({ size = 64, className = "" }) {
  return (
    <img
      src="/images/rodas.jpg"
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size, objectPosition: "50% 18%" }}
      className={`rounded-full object-cover ${className}`}
    />
  );
}

export function Goat({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <path d="M38 34 C30 14 18 12 14 20 C24 20 30 28 34 40" fill="#8A5A2B" />
      <path d="M82 34 C90 14 102 12 106 20 C96 20 90 28 86 40" fill="#8A5A2B" />
      <ellipse cx="22" cy="56" rx="14" ry="8" fill="#C98B4E" transform="rotate(-20 22 56)" />
      <ellipse cx="98" cy="56" rx="14" ry="8" fill="#C98B4E" transform="rotate(20 98 56)" />
      <ellipse cx="60" cy="62" rx="34" ry="38" fill="#E0A869" />
      <ellipse cx="60" cy="84" rx="18" ry="14" fill="#F3D2A8" />
      <circle cx="47" cy="56" r="6" fill="#102542" />
      <circle cx="73" cy="56" r="6" fill="#102542" />
      <circle cx="49" cy="54" r="2" fill="#FFFFFF" />
      <circle cx="75" cy="54" r="2" fill="#FFFFFF" />
      <path d="M52 88 Q60 95 68 88" stroke="#102542" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Sheep({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <g fill="#FFFFFF" stroke="#D9CBB0" strokeWidth="3">
        <circle cx="38" cy="40" r="16" />
        <circle cx="60" cy="30" r="17" />
        <circle cx="82" cy="40" r="16" />
        <circle cx="30" cy="62" r="15" />
        <circle cx="90" cy="62" r="15" />
      </g>
      <ellipse cx="60" cy="68" rx="24" ry="30" fill="#3A3F4A" />
      <circle cx="51" cy="64" r="4.5" fill="#FFFFFF" />
      <circle cx="69" cy="64" r="4.5" fill="#FFFFFF" />
      <path d="M52 84 Q60 90 68 84" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Camel({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <ellipse cx="60" cy="66" rx="30" ry="34" fill="#D9A25F" />
      <ellipse cx="60" cy="88" rx="20" ry="14" fill="#E9C08A" />
      <ellipse cx="34" cy="40" rx="8" ry="12" fill="#D9A25F" />
      <ellipse cx="86" cy="40" rx="8" ry="12" fill="#D9A25F" />
      <circle cx="48" cy="60" r="5" fill="#102542" />
      <circle cx="72" cy="60" r="5" fill="#102542" />
      <path d="M52 92 Q60 98 68 92" stroke="#102542" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Grandma({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <path d="M18 70 Q18 18 60 16 Q102 18 102 70 L102 104 L18 104 Z" fill="#FFFFFF" stroke="#D9CBB0" strokeWidth="3" />
      <circle cx="60" cy="62" r="28" fill="#7A4E33" />
      <circle cx="50" cy="60" r="4" fill="#102542" />
      <circle cx="70" cy="60" r="4" fill="#102542" />
      <path d="M50 74 Q60 81 70 74" stroke="#102542" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M22 92 L98 92" stroke="#1E7A46" strokeWidth="4" />
      <path d="M22 98 L98 98" stroke="#E0A400" strokeWidth="4" />
    </svg>
  );
}

export const TEACHERS = [
  { id: "rodas", name: "Rodas", note: "AI teacher", Pic: Rodas },
  { id: "abeba", name: "Grandma Abeba", short: "Grandma", note: "Stories and songs", Pic: Grandma },
  { id: "fiyel", name: "Fiyel the goat", short: "Fiyel", note: "Games and jokes", Pic: Goat },
  { id: "bebe", name: "Bebe the sheep", short: "Bebe", note: "Calm, for little ones", Pic: Sheep },
  { id: "gemel", name: "Gemel the camel", short: "Gemel", note: "Counting and math", Pic: Camel },
];
