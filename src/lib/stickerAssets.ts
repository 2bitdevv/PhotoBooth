function toDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const STICKER_ASSETS = {
  heartSparkle: toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M50 88C50 88 8 62 8 35C8 22 18 12 31 12C40 12 47 16 50 24C53 16 60 12 69 12C82 12 92 22 92 35C92 62 50 88 50 88Z" fill="#fb7185"/>
      <circle cx="74" cy="23" r="6" fill="#fff1f2"/>
      <path d="M78 10l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#fdf2f8"/>
    </svg>`
  ),
  pinkBow: toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <ellipse cx="30" cy="42" rx="22" ry="16" fill="#f9a8d4"/>
      <ellipse cx="70" cy="42" rx="22" ry="16" fill="#f472b6"/>
      <circle cx="50" cy="46" r="11" fill="#ec4899"/>
      <path d="M44 55L36 88M56 55L64 88" stroke="#db2777" stroke-width="7" stroke-linecap="round"/>
    </svg>`
  ),
  teddyFace: toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="26" cy="28" r="14" fill="#d6a977"/><circle cx="74" cy="28" r="14" fill="#d6a977"/>
      <circle cx="50" cy="52" r="32" fill="#e7b985"/>
      <circle cx="50" cy="62" r="11" fill="#f5d0a7"/>
      <circle cx="38" cy="50" r="4"/><circle cx="62" cy="50" r="4"/>
      <path d="M45 64c3 4 7 4 10 0" stroke="#7c4a1f" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`
  ),
  cloudBlue: toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M24 70h50a16 16 0 1 0-2-32 21 21 0 0 0-40-4A14 14 0 0 0 24 70z" fill="#bfdbfe"/>
      <path d="M23 66h50a12 12 0 1 0-2-24 16 16 0 0 0-31-3A10 10 0 0 0 23 66z" fill="#e0f2fe"/>
    </svg>`
  ),
  bubble: toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="28" fill="#bae6fd" fill-opacity="0.55" stroke="#38bdf8" stroke-width="4"/>
      <circle cx="36" cy="38" r="6" fill="#ffffff" fill-opacity="0.8"/>
      <circle cx="66" cy="62" r="4" fill="#ffffff" fill-opacity="0.6"/>
    </svg>`
  ),
  starGlass: toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M50 9l12 24 27 4-19 19 5 27-25-13-25 13 5-27-19-19 27-4z" fill="#93c5fd"/>
      <path d="M50 16l9 18 20 3-14 14 4 20-19-10-19 10 4-20-14-14 20-3z" fill="#dbeafe"/>
    </svg>`
  ),
  flowerPink: toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="11" fill="#f9a8d4"/>
      <ellipse cx="50" cy="24" rx="13" ry="18" fill="#fbcfe8"/>
      <ellipse cx="76" cy="50" rx="18" ry="13" fill="#fbcfe8"/>
      <ellipse cx="50" cy="76" rx="13" ry="18" fill="#fbcfe8"/>
      <ellipse cx="24" cy="50" rx="18" ry="13" fill="#fbcfe8"/>
      <ellipse cx="68" cy="32" rx="11" ry="14" fill="#f9a8d4"/>
      <ellipse cx="32" cy="68" rx="11" ry="14" fill="#f9a8d4"/>
    </svg>`
  ),
  rainbow: toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M12 70a38 38 0 0 1 76 0" stroke="#fb7185" stroke-width="8" fill="none"/>
      <path d="M18 70a32 32 0 0 1 64 0" stroke="#f59e0b" stroke-width="8" fill="none"/>
      <path d="M24 70a26 26 0 0 1 52 0" stroke="#facc15" stroke-width="8" fill="none"/>
      <path d="M30 70a20 20 0 0 1 40 0" stroke="#4ade80" stroke-width="8" fill="none"/>
      <path d="M36 70a14 14 0 0 1 28 0" stroke="#60a5fa" stroke-width="8" fill="none"/>
      <circle cx="14" cy="71" r="9" fill="#f8fafc"/><circle cx="86" cy="71" r="9" fill="#f8fafc"/>
    </svg>`
  ),
  butterfly: toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <ellipse cx="33" cy="39" rx="19" ry="15" fill="#93c5fd"/>
      <ellipse cx="67" cy="39" rx="19" ry="15" fill="#bfdbfe"/>
      <ellipse cx="33" cy="63" rx="16" ry="12" fill="#60a5fa"/>
      <ellipse cx="67" cy="63" rx="16" ry="12" fill="#93c5fd"/>
      <rect x="47" y="28" width="6" height="44" rx="3" fill="#1e3a8a"/>
      <path d="M50 28c-4-10-8-11-13-13M50 28c4-10 8-11 13-13" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`
  ),
  sparkleCluster: toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M25 16l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#fef3c7"/>
      <path d="M72 24l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#fde68a"/>
      <path d="M55 55l5 12 12 5-12 5-5 12-5-12-12-5 12-5z" fill="#fcd34d"/>
      <circle cx="27" cy="67" r="5" fill="#fde68a"/>
    </svg>`
  ),
  sakura: toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M50 31c6-9 15-11 22-6-1 8-8 14-18 15 8 1 14 7 15 15-8 4-16 1-20-6 2 8-2 16-10 20-6-6-7-14-1-21-7 6-16 5-22-1 2-8 9-12 17-12-8-3-12-10-10-19 8-2 16 2 20 10 0-8 5-14 13-15z" fill="#f9a8d4"/>
      <circle cx="50" cy="50" r="8" fill="#f43f5e"/>
    </svg>`
  ),
  ribbonRed: toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M50 47C32 47 22 34 20 18c15 2 27 12 30 25M50 47c18 0 28-13 30-29-15 2-27 12-30 25" fill="#ef4444"/>
      <circle cx="50" cy="50" r="8" fill="#dc2626"/>
      <path d="M45 57l-9 31 14-13M55 57l9 31-14-13" fill="#b91c1c"/>
    </svg>`
  ),
  heartOutline: toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M50 85S12 60 12 35c0-11 9-20 20-20 8 0 14 4 18 10 4-6 10-10 18-10 11 0 20 9 20 20 0 25-38 50-38 50z" fill="none" stroke="#fb7185" stroke-width="7"/>
      <path d="M50 76S21 56 21 37c0-7 6-13 13-13 6 0 10 3 16 12 6-9 10-12 16-12 7 0 13 6 13 13 0 19-29 39-29 39z" fill="#ffe4e6"/>
    </svg>`
  ),
} as const;

export type StickerAssetId = keyof typeof STICKER_ASSETS;
