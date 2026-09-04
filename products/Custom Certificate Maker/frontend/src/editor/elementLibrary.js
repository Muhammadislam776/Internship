// Decorative Element Library for Canvas Editor
export const ELEMENT_CATEGORIES = {
  BORDERS: 'Borders',
  CORNERS: 'Corners',
  SEALS: 'Seals & Medals',
  DIVIDERS: 'Dividers & Lines',
  BADGES: 'Badges & Ribbons'
};

export const DECORATIVE_ELEMENTS = [
  {
    id: 'gold-seal-1',
    name: 'Gold Excellence Seal',
    category: ELEMENT_CATEGORIES.SEALS,
    svg: `<svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#D4AF37" stroke="#F59E0B" stroke-width="2"/>
      <circle cx="50" cy="50" r="38" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="3 3"/>
      <path d="M50 20L57 35L74 38L62 50L65 67L50 59L35 67L38 50L26 38L43 35L50 20Z" fill="#FFFBEB"/>
      <text x="50" y="78" text-anchor="middle" fill="#FFFFFF" font-size="8" font-weight="bold" font-family="Montserrat">OFFICIAL SEAL</text>
    </svg>`
  },
  {
    id: 'certified-badge',
    name: 'Verified Star Badge',
    category: ELEMENT_CATEGORIES.BADGES,
    svg: `<svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5L61 17L77 15L80 31L94 39L88 54L94 69L80 77L77 93L61 91L50 103L39 91L23 93L20 77L6 69L12 54L6 39L20 31L23 15L39 17L50 5Z" fill="#0284C7"/>
      <circle cx="50" cy="54" r="30" fill="#0F172A"/>
      <path d="M40 54L47 61L62 45" stroke="#38BDF8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
  },
  {
    id: 'corner-gold-ornate',
    name: 'Gold Ornate Corner',
    category: ELEMENT_CATEGORIES.CORNERS,
    svg: `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 90V20C10 14.4772 14.4772 10 20 10H90" stroke="#D4AF37" stroke-width="4" stroke-linecap="round"/>
      <path d="M20 80V30C20 24.4772 24.4772 20 30 20H80" stroke="#F59E0B" stroke-width="1.5"/>
      <circle cx="20" cy="20" r="6" fill="#D4AF37"/>
    </svg>`
  },
  {
    id: 'divider-ornate-gold',
    name: 'Classic Gold Divider',
    category: ELEMENT_CATEGORIES.DIVIDERS,
    svg: `<svg width="300" height="30" viewBox="0 0 300 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 15H120M180 15H290" stroke="#D4AF37" stroke-width="2"/>
      <polygon points="150,5 160,15 150,25 140,15" fill="#D4AF37"/>
      <circle cx="130" cy="15" r="3" fill="#D4AF37"/>
      <circle cx="170" cy="15" r="3" fill="#D4AF37"/>
    </svg>`
  }
];
