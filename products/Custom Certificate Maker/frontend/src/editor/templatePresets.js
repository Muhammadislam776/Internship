export const FONT_OPTIONS = [
  { name: 'Cinzel (Serif Academic)', family: 'Cinzel' },
  { name: 'Playfair Display (Serif Classic)', family: 'Playfair Display' },
  { name: 'Cormorant Garamond (Serif Luxury)', family: 'Cormorant Garamond' },
  { name: 'Montserrat (Modern Sans)', family: 'Montserrat' },
  { name: 'Inter (Clean Sans)', family: 'Inter' },
  { name: 'Great Vibes (Script Elegant)', family: 'Great Vibes' },
  { name: 'Alex Brush (Script Cursive)', family: 'Alex Brush' },
  { name: 'Roboto (Standard Sans)', family: 'Roboto' }
];

export const TEMPLATE_PRESETS = [
  {
    id: 'blank-canvas',
    name: 'Blank Certificate Canvas',
    category: 'All',
    description: 'Start from scratch with a clean, customizable white A4 canvas and gold border frame.',
    orientation: 'landscape',
    bg: '#FFFFFF',
    borderColor: '#D4AF37',
    borderType: 'double',
    designData: {
      background: '#FFFFFF',
      borderColor: '#D4AF37',
      elements: [
        { type: 'text', text: 'INSTITUTION NAME', fontFamily: 'Montserrat', fontSize: 16, fill: '#64748B', top: 120, left: 960, tracking: 4, fontWeight: 'bold' },
        { type: 'text', text: 'CERTIFICATE TITLE', fontFamily: 'Cinzel', fontSize: 44, fill: '#D4AF37', top: 180, left: 960, fontWeight: 'bold' },
        { type: 'text', text: 'PROUDLY PRESENTED TO', fontFamily: 'Montserrat', fontSize: 13, fill: '#94A3B8', top: 270, left: 960, tracking: 6 },
        { type: 'text', text: '{{recipientName}}', fontFamily: 'Playfair Display', fontSize: 56, fill: '#0F172A', top: 340, left: 960, fontWeight: 'bold' },
        { type: 'text', text: '{{courseName}}', fontFamily: 'Montserrat', fontSize: 30, fill: '#D4AF37', top: 550, left: 960, fontWeight: 'bold' }
      ]
    }
  },
  {
    id: 'canva-modern-blue-gold',
    name: 'Canva Modern Blue & Gold',
    category: 'Achievement',
    description: 'Inspired by Canva reference EAGzvZrLbrc. Deep navy blue background, metallic gold ribbons, serif title, and gold text.',
    orientation: 'landscape',
    bg: '#0B192C',
    borderColor: '#D4AF37',
    borderType: 'double',
    designData: {
      background: '#0B192C',
      borderColor: '#D4AF37',
      elements: [
        { type: 'text', text: 'GLOBAL ACADEMY OF EXCELLENCE', fontFamily: 'Montserrat', fontSize: 16, fill: '#D4AF37', color: '#D4AF37', top: 120, left: 960, tracking: 5, fontWeight: 'bold' },
        { type: 'text', text: 'CERTIFICATE OF ACHIEVEMENT', fontFamily: 'Cinzel', fontSize: 46, fill: '#FCD34D', color: '#FCD34D', top: 180, left: 960, fontWeight: 'bold' },
        { type: 'text', text: 'THIS CERTIFICATE IS PROUDLY PRESENTED TO', fontFamily: 'Montserrat', fontSize: 13, fill: '#CBD5E1', color: '#CBD5E1', top: 270, left: 960, tracking: 6 },
        { type: 'text', text: '{{recipientName}}', fontFamily: 'Playfair Display', fontSize: 58, fill: '#F59E0B', color: '#F59E0B', top: 340, left: 960, fontWeight: 'bold' },
        { type: 'text', text: '________________________________________________', fontFamily: 'Cinzel', fontSize: 16, fill: '#D4AF37', color: '#D4AF37', top: 430, left: 960 },
        { type: 'text', text: 'In recognition of outstanding achievement, dedication and successful completion of', fontFamily: 'Inter', fontSize: 18, fill: '#E2E8F0', color: '#E2E8F0', top: 490, left: 960 },
        { type: 'text', text: '{{courseName}}', fontFamily: 'Montserrat', fontSize: 32, fill: '#FCD34D', color: '#FCD34D', top: 550, left: 960, fontWeight: 'bold' },
        { type: 'text', text: 'Issued under official seal on {{issueDate}}  •  ID: {{certificateId}}', fontFamily: 'Inter', fontSize: 14, fill: '#94A3B8', color: '#94A3B8', top: 650, left: 960 },
        { type: 'text', text: '______________________', fontFamily: 'Inter', fontSize: 16, fill: '#64748B', color: '#64748B', top: 820, left: 400 },
        { type: 'text', text: 'Authorized Director', fontFamily: 'Inter', fontSize: 14, fill: '#F59E0B', color: '#F59E0B', top: 860, left: 400, fontWeight: 'bold' },
        { type: 'text', text: '______________________', fontFamily: 'Inter', fontSize: 16, fill: '#64748B', color: '#64748B', top: 820, left: 1520 },
        { type: 'text', text: 'Vice Chancellor', fontFamily: 'Inter', fontSize: 14, fill: '#F59E0B', color: '#F59E0B', top: 860, left: 1520, fontWeight: 'bold' }
      ]
    }
  },
  {
    id: 'canva-elegant-gold-frame',
    name: 'Canva Elegant Gold Frame',
    category: 'Academic',
    description: 'Inspired by Canva reference EAGkUCpNNu8. Ivory parchment, ornate gold scrollwork frame, cursive recipient focus.',
    orientation: 'landscape',
    bg: '#FFFDF7',
    borderColor: '#B45309',
    borderType: 'ornate-gold',
    designData: {
      background: '#FFFDF7',
      borderColor: '#B45309',
      elements: [
        { type: 'text', text: 'INTERNATIONAL DIPLOMA COUNCIL', fontFamily: 'Cinzel', fontSize: 16, fill: '#78350F', color: '#78350F', top: 120, left: 960, tracking: 4, fontWeight: 'bold' },
        { type: 'text', text: 'DIPLOMA OF HIGH EXCELLENCE', fontFamily: 'Cinzel', fontSize: 44, fill: '#B45309', color: '#B45309', top: 180, left: 960, fontWeight: 'bold' },
        { type: 'text', text: 'BE IT KNOWN TO ALL THAT', fontFamily: 'Montserrat', fontSize: 13, fill: '#92400E', color: '#92400E', top: 270, left: 960, tracking: 6 },
        { type: 'text', text: '{{recipientName}}', fontFamily: 'Great Vibes', fontSize: 68, fill: '#78350F', color: '#78350F', top: 340, left: 960 },
        { type: 'text', text: 'having fulfilled all scholarly requirements is awarded this formal diploma in', fontFamily: 'Inter', fontSize: 18, fill: '#78350F', color: '#78350F', top: 480, left: 960 },
        { type: 'text', text: '{{courseName}}', fontFamily: 'Cinzel', fontSize: 32, fill: '#B45309', color: '#B45309', top: 550, left: 960, fontWeight: 'bold' },
        { type: 'text', text: 'Given on {{issueDate}}  •  Registration ID: {{certificateId}}', fontFamily: 'Inter', fontSize: 14, fill: '#92400E', color: '#92400E', top: 650, left: 960 },
        { type: 'text', text: '______________________', fontFamily: 'Inter', fontSize: 16, fill: '#D97706', color: '#D97706', top: 820, left: 400 },
        { type: 'text', text: 'Dean of Faculty', fontFamily: 'Inter', fontSize: 14, fill: '#78350F', color: '#78350F', top: 860, left: 400, fontWeight: 'bold' },
        { type: 'text', text: '______________________', fontFamily: 'Inter', fontSize: 16, fill: '#D97706', color: '#D97706', top: 820, left: 1520 },
        { type: 'text', text: 'Registrar General', fontFamily: 'Inter', fontSize: 14, fill: '#78350F', color: '#78350F', top: 860, left: 1520, fontWeight: 'bold' }
      ]
    }
  },
  {
    id: 'canva-minimal-crest-appreciation',
    name: 'Canva Minimalist Crest',
    category: 'Appreciation',
    description: 'Inspired by Canva reference EAFDAAsWHG8. Pure white background, thin double navy borders, crest placement, bold typography.',
    orientation: 'landscape',
    bg: '#FFFFFF',
    borderColor: '#1E3A8A',
    borderType: 'double',
    designData: {
      background: '#FFFFFF',
      borderColor: '#1E3A8A',
      elements: [
        { type: 'text', text: 'NATIONAL FOUNDATION OF APPRECIATION', fontFamily: 'Montserrat', fontSize: 16, fill: '#1E3A8A', color: '#1E3A8A', top: 120, left: 960, tracking: 5, fontWeight: 'bold' },
        { type: 'text', text: 'CERTIFICATE OF APPRECIATION', fontFamily: 'Montserrat', fontSize: 42, fill: '#0F172A', color: '#0F172A', top: 180, left: 960, fontWeight: 'bold' },
        { type: 'text', text: 'IN SINCERE GRATITUDE TO', fontFamily: 'Inter', fontSize: 13, fill: '#1E3A8A', color: '#1E3A8A', top: 270, left: 960, tracking: 8 },
        { type: 'text', text: '{{recipientName}}', fontFamily: 'Montserrat', fontSize: 54, fill: '#0F172A', color: '#0F172A', top: 340, left: 960, fontWeight: 'bold' },
        { type: 'text', text: 'In deep recognition of invaluable service, commitment and outstanding contribution to', fontFamily: 'Inter', fontSize: 18, fill: '#475569', color: '#475569', top: 480, left: 960 },
        { type: 'text', text: '{{courseName}}', fontFamily: 'Montserrat', fontSize: 32, fill: '#1E3A8A', color: '#1E3A8A', top: 550, left: 960, fontWeight: 'bold' },
        { type: 'text', text: 'Presented on {{issueDate}}  •  Verification: {{certificateId}}', fontFamily: 'Inter', fontSize: 14, fill: '#64748B', color: '#64748B', top: 650, left: 960 },
        { type: 'text', text: '______________________', fontFamily: 'Inter', fontSize: 16, fill: '#CBD5E1', color: '#CBD5E1', top: 820, left: 450 },
        { type: 'text', text: 'Executive Chairman', fontFamily: 'Inter', fontSize: 14, fill: '#1E3A8A', color: '#1E3A8A', top: 860, left: 450, fontWeight: 'bold' },
        { type: 'text', text: '______________________', fontFamily: 'Inter', fontSize: 16, fill: '#CBD5E1', color: '#CBD5E1', top: 820, left: 1470 },
        { type: 'text', text: 'Trustee Director', fontFamily: 'Inter', fontSize: 14, fill: '#1E3A8A', color: '#1E3A8A', top: 860, left: 1470, fontWeight: 'bold' }
      ]
    }
  },
  {
    id: 'classic-gold',
    name: 'Classic Gold Academic',
    category: 'Academic',
    description: 'Ivory background, double gold borders, serif academic typography, dual signature blocks & official gold seal.',
    orientation: 'landscape',
    bg: '#FDFBF7',
    borderColor: '#D4AF37',
    borderType: 'double',
    designData: {
      background: '#FDFBF7',
      borderColor: '#D4AF37',
      elements: [
        { type: 'text', text: 'TECH ACADEMY INSTITUTE OF EDUCATION', fontFamily: 'Montserrat', fontSize: 16, fill: '#1B365D', color: '#1B365D', top: 120, left: 960, tracking: 4, fontWeight: 'bold' },
        { type: 'text', text: 'CERTIFICATE OF ACHIEVEMENT', fontFamily: 'Cinzel', fontSize: 44, fill: '#D4AF37', color: '#D4AF37', top: 180, left: 960, fontWeight: 'bold' },
        { type: 'text', text: 'THIS CERTIFICATE IS PROUDLY CONFERRED UPON', fontFamily: 'Montserrat', fontSize: 13, fill: '#64748B', color: '#64748B', top: 270, left: 960, tracking: 6 },
        { type: 'text', text: '{{recipientName}}', fontFamily: 'Playfair Display', fontSize: 56, fill: '#1B365D', color: '#1B365D', top: 340, left: 960, fontWeight: 'bold' },
        { type: 'text', text: 'In recognition of successful completion and outstanding performance in', fontFamily: 'Inter', fontSize: 18, fill: '#334155', color: '#334155', top: 490, left: 960 },
        { type: 'text', text: '{{courseName}}', fontFamily: 'Montserrat', fontSize: 32, fill: '#D4AF37', color: '#D4AF37', top: 550, left: 960, fontWeight: 'bold' }
      ]
    }
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal Corporate',
    category: 'Corporate',
    description: 'Clean white background, deep cyan accents, modern sans-serif typography with strong visual whitespace.',
    orientation: 'landscape',
    bg: '#FFFFFF',
    borderColor: '#0284C7',
    borderType: 'minimal',
    designData: {
      background: '#FFFFFF',
      borderColor: '#0284C7',
      elements: [
        { type: 'text', text: 'GLOBAL TECH ENTERPRISE', fontFamily: 'Montserrat', fontSize: 16, fill: '#0284C7', color: '#0284C7', top: 120, left: 960, tracking: 5, fontWeight: 'bold' },
        { type: 'text', text: 'CERTIFICATE OF COMPLETION', fontFamily: 'Montserrat', fontSize: 42, fill: '#0F172A', color: '#0F172A', top: 180, left: 960, fontWeight: 'bold' },
        { type: 'text', text: 'PROUDLY PRESENTED TO', fontFamily: 'Inter', fontSize: 13, fill: '#0284C7', color: '#0284C7', top: 270, left: 960, tracking: 8 },
        { type: 'text', text: '{{recipientName}}', fontFamily: 'Inter', fontSize: 54, fill: '#0F172A', color: '#0F172A', top: 340, left: 960, fontWeight: 'bold' },
        { type: 'text', text: '{{courseName}}', fontFamily: 'Montserrat', fontSize: 32, fill: '#0284C7', color: '#0284C7', top: 550, left: 960, fontWeight: 'bold' }
      ]
    }
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Obsidian & Gold',
    category: 'Luxury',
    description: 'Dark obsidian background, intricate gold ornate frame, script recipient name, gold medallion.',
    orientation: 'landscape',
    bg: '#0F172A',
    borderColor: '#F59E0B',
    borderType: 'ornate-gold',
    designData: {
      background: '#0F172A',
      borderColor: '#F59E0B',
      elements: [
        { type: 'text', text: 'EXECUTIVE DIPLOMA OF HONOR', fontFamily: 'Cinzel', fontSize: 44, fill: '#FCD34D', color: '#FCD34D', top: 180, left: 960, fontWeight: 'bold' },
        { type: 'text', text: '{{recipientName}}', fontFamily: 'Great Vibes', fontSize: 68, fill: '#F59E0B', color: '#F59E0B', top: 340, left: 960 },
        { type: 'text', text: '{{courseName}}', fontFamily: 'Cinzel', fontSize: 32, fill: '#FCD34D', color: '#FCD34D', top: 550, left: 960, fontWeight: 'bold' }
      ]
    }
  },
  {
    id: 'royal-blue',
    name: 'Royal Blue Academic Crest',
    category: 'Academic',
    description: 'Formal royal blue outer frame, crest placement, serif diploma typography.',
    orientation: 'landscape',
    bg: '#FAFAFA',
    borderColor: '#1E40AF',
    borderType: 'royal-blue',
    designData: {
      background: '#FAFAFA',
      borderColor: '#1E40AF',
      elements: [
        { type: 'text', text: 'DIPLOMA OF HIGH HONORS', fontFamily: 'Cinzel', fontSize: 44, fill: '#1E40AF', color: '#1E40AF', top: 180, left: 960, fontWeight: 'bold' },
        { type: 'text', text: '{{recipientName}}', fontFamily: 'Playfair Display', fontSize: 56, fill: '#0F172A', color: '#0F172A', top: 340, left: 960, fontWeight: 'bold' },
        { type: 'text', text: '{{courseName}}', fontFamily: 'Montserrat', fontSize: 32, fill: '#1E40AF', color: '#1E40AF', top: 550, left: 960, fontWeight: 'bold' }
      ]
    }
  },
  {
    id: 'green-elegant',
    name: 'Green Emerald Institute',
    category: 'Participation',
    description: 'Emerald green curved frame, certified badge, cursive recipient focus.',
    orientation: 'landscape',
    bg: '#F0FDF4',
    borderColor: '#166534',
    borderType: 'emerald',
    designData: {
      background: '#F0FDF4',
      borderColor: '#166534',
      elements: [
        { type: 'text', text: 'CERTIFICATE OF PARTICIPATION', fontFamily: 'Montserrat', fontSize: 40, fill: '#14532D', color: '#14532D', top: 180, left: 960, fontWeight: 'bold' },
        { type: 'text', text: '{{recipientName}}', fontFamily: 'Alex Brush', fontSize: 62, fill: '#166534', color: '#166534', top: 340, left: 960 },
        { type: 'text', text: '{{courseName}}', fontFamily: 'Inter', fontSize: 30, fill: '#15803D', color: '#15803D', top: 550, left: 960, fontWeight: 'bold' }
      ]
    }
  },
  {
    id: 'creative-tech',
    name: 'Creative Technology Cyber',
    category: 'Technology',
    description: 'Cyber dark background, neon purple accents, technical font hierarchy.',
    orientation: 'landscape',
    bg: '#0F172A',
    borderColor: '#8B5CF6',
    borderType: 'cyber',
    designData: {
      background: '#0F172A',
      borderColor: '#8B5CF6',
      elements: [
        { type: 'text', text: 'INTERNSHIP & SKILLS CERTIFICATE', fontFamily: 'Montserrat', fontSize: 40, fill: '#C084FC', color: '#C084FC', top: 180, left: 960, fontWeight: 'bold' },
        { type: 'text', text: '{{recipientName}}', fontFamily: 'Inter', fontSize: 52, fill: '#F8FAFC', color: '#F8FAFC', top: 340, left: 960, fontWeight: 'bold' },
        { type: 'text', text: '{{courseName}}', fontFamily: 'Montserrat', fontSize: 32, fill: '#C084FC', color: '#C084FC', top: 550, left: 960, fontWeight: 'bold' }
      ]
    }
  },
  {
    id: 'premium-frame',
    name: 'Traditional Ornate Bronze',
    category: 'Classic',
    description: 'Multi-layer ornate bronze frame, serif heading, formal diploma style.',
    orientation: 'landscape',
    bg: '#FFFDF9',
    borderColor: '#B45309',
    borderType: 'bronze-frame',
    designData: {
      background: '#FFFDF9',
      borderColor: '#B45309',
      elements: [
        { type: 'text', text: 'CERTIFICATE OF HONOR', fontFamily: 'Cinzel', fontSize: 44, fill: '#B45309', color: '#B45309', top: 180, left: 960, fontWeight: 'bold' },
        { type: 'text', text: '{{recipientName}}', fontFamily: 'Playfair Display', fontSize: 56, fill: '#451A03', color: '#451A03', top: 340, left: 960, fontWeight: 'bold' },
        { type: 'text', text: '{{courseName}}', fontFamily: 'Cinzel', fontSize: 32, fill: '#B45309', color: '#B45309', top: 550, left: 960, fontWeight: 'bold' }
      ]
    }
  },
  {
    id: 'blue-gold-executive',
    name: 'Executive Award Geometric',
    category: 'Corporate',
    description: 'Navy blue side bands, gold diagonal accents, executive corporate font.',
    orientation: 'landscape',
    bg: '#FFFFFF',
    borderColor: '#1E3A8A',
    borderType: 'executive',
    designData: {
      background: '#FFFFFF',
      borderColor: '#1E3A8A',
      elements: [
        { type: 'text', text: 'EXECUTIVE RECOGNITION AWARD', fontFamily: 'Montserrat', fontSize: 40, fill: '#1E3A8A', color: '#1E3A8A', top: 180, left: 960, fontWeight: 'bold' },
        { type: 'text', text: '{{recipientName}}', fontFamily: 'Inter', fontSize: 54, fill: '#0F172A', color: '#0F172A', top: 340, left: 960, fontWeight: 'bold' },
        { type: 'text', text: '{{courseName}}', fontFamily: 'Montserrat', fontSize: 32, fill: '#1E3A8A', color: '#1E3A8A', top: 550, left: 960, fontWeight: 'bold' }
      ]
    }
  },
  {
    id: 'soft-elegant',
    name: 'Soft Linen Appreciation',
    category: 'Appreciation',
    description: 'Warm cream parchment, soft golden accents, script heading.',
    orientation: 'landscape',
    bg: '#FFFDF5',
    borderColor: '#D97706',
    borderType: 'linen',
    designData: {
      background: '#FFFDF5',
      borderColor: '#D97706',
      elements: [
        { type: 'text', text: 'CERTIFICATE OF APPRECIATION', fontFamily: 'Cormorant Garamond', fontSize: 44, fill: '#B45309', color: '#B45309', top: 180, left: 960, fontWeight: 'bold' },
        { type: 'text', text: '{{recipientName}}', fontFamily: 'Great Vibes', fontSize: 64, fill: '#78350F', color: '#78350F', top: 340, left: 960 },
        { type: 'text', text: '{{courseName}}', fontFamily: 'Cormorant Garamond', fontSize: 32, fill: '#B45309', color: '#B45309', top: 550, left: 960, fontWeight: 'bold' }
      ]
    }
  },
  {
    id: 'achievement-award',
    name: 'High-Impact Achievement Star',
    category: 'Achievement',
    description: 'Star badge medallion, crimson award border, high impact font focus.',
    orientation: 'landscape',
    bg: '#FAFAFA',
    borderColor: '#DC2626',
    borderType: 'crimson',
    designData: {
      background: '#FAFAFA',
      borderColor: '#DC2626',
      elements: [
        { type: 'text', text: 'OUTSTANDING ACHIEVEMENT AWARD', fontFamily: 'Montserrat', fontSize: 40, fill: '#DC2626', color: '#DC2626', top: 180, left: 960, fontWeight: 'bold' },
        { type: 'text', text: '{{recipientName}}', fontFamily: 'Montserrat', fontSize: 54, fill: '#111827', color: '#111827', top: 340, left: 960, fontWeight: 'bold' },
        { type: 'text', text: '{{courseName}}', fontFamily: 'Montserrat', fontSize: 32, fill: '#991B1B', color: '#991B1B', top: 550, left: 960, fontWeight: 'bold' }
      ]
    }
  },
  {
    id: 'diamond-platinum',
    name: 'Diamond Platinum Fellow',
    category: 'Luxury',
    description: 'Ultra-luxury silver metallic frame, dark slate background, Cinzel serif typography.',
    orientation: 'landscape',
    bg: '#0F172A',
    borderColor: '#94A3B8',
    borderType: 'double',
    designData: {
      background: '#0F172A',
      borderColor: '#94A3B8',
      elements: [
        { type: 'text', text: 'PLATINUM DIPLOMA OF FELLOWSHIP', fontFamily: 'Cinzel', fontSize: 44, fill: '#F8FAFC', color: '#F8FAFC', top: 180, left: 960, fontWeight: 'bold' },
        { type: 'text', text: '{{recipientName}}', fontFamily: 'Playfair Display', fontSize: 56, fill: '#38BDF8', color: '#38BDF8', top: 340, left: 960, fontWeight: 'bold' },
        { type: 'text', text: '{{courseName}}', fontFamily: 'Cinzel', fontSize: 32, fill: '#38BDF8', color: '#38BDF8', top: 550, left: 960, fontWeight: 'bold' }
      ]
    }
  },
  {
    id: 'ai-cloud-cyber',
    name: 'AI & Cloud Tech Master',
    category: 'Technology',
    description: 'Glowing cyan and emerald nodes, obsidian background, futuristic AI engineering layout.',
    orientation: 'landscape',
    bg: '#020617',
    borderColor: '#06B6D4',
    borderType: 'cyber',
    designData: {
      background: '#020617',
      borderColor: '#06B6D4',
      elements: [
        { type: 'text', text: 'CERTIFIED AI & CLOUD MASTER', fontFamily: 'Montserrat', fontSize: 42, fill: '#38BDF8', color: '#38BDF8', top: 180, left: 960, fontWeight: 'bold' },
        { type: 'text', text: '{{recipientName}}', fontFamily: 'Inter', fontSize: 54, fill: '#F8FAFC', color: '#F8FAFC', top: 340, left: 960, fontWeight: 'bold' },
        { type: 'text', text: '{{courseName}}', fontFamily: 'Montserrat', fontSize: 32, fill: '#34D399', color: '#34D399', top: 550, left: 960, fontWeight: 'bold' }
      ]
    }
  }
];
