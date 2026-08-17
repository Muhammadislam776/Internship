// HyperList Dataset Generator
// Generates 1,250 deterministic, realistic tech, design, business, and modern SaaS items

export const CATEGORIES = [
  'Technology',
  'Design',
  'Business',
  'Marketing',
  'Finance',
  'Education',
  'Health',
  'Entertainment'
];

export const STATUSES = ['Active', 'Featured', 'Pending', 'Archived'];

export const SORT_OPTIONS = [
  { label: 'Name (A → Z)', value: 'name_asc' },
  { label: 'Name (Z → A)', value: 'name_desc' },
  { label: 'Highest Rating', value: 'rating_desc' },
  { label: 'Lowest Rating', value: 'rating_asc' },
  { label: 'Highest Value', value: 'price_desc' },
  { label: 'Lowest Value', value: 'price_asc' },
  { label: 'Newest First', value: 'date_desc' },
  { label: 'Oldest First', value: 'date_asc' },
];

const PREFIXES = [
  'Hyper', 'Quantum', 'Nexus', 'Apex', 'Vortex', 'Cyber', 'Aura', 'Lumina',
  'Pulse', 'Zenith', 'Omni', 'Nova', 'Echo', 'Sync', 'Stellar', 'Prism',
  'Vector', 'Matrix', 'Flux', 'Orbit', 'Helix', 'Titan', 'Spectra', 'Aether'
];

const NOUNS = [
  'Engine', 'Flow', 'Grid', 'Studio', 'Pulse', 'Lab', 'Forge', 'Node',
  'Core', 'Hub', 'Sphere', 'Vault', 'Craft', 'Bridge', 'Link', 'Dash',
  'Analytics', 'Sync', 'Metrics', 'Pilot', 'Stream', 'Shift', 'Stack', 'Vision'
];

const SUFFIXES = ['Pro', 'AI', 'v4', 'Ultra', 'Enterprise', 'Cloud', 'X', 'Prime', 'Suite', 'OS', 'Lite', 'Max'];

const CATEGORY_TAGS = {
  Technology: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Rust', 'WebAssembly', 'Cloud', 'API', 'Docker', 'K8s'],
  Design: ['UI/UX', 'Figma', 'Design System', '3D', 'Tailwind', 'Motion', 'Typography', 'Color', 'Prototypes', 'Icons'],
  Business: ['SaaS', 'Workflow', 'CRM', 'Automation', 'Strategy', 'Analytics', 'Scale', 'Productivity', 'Growth', 'B2B'],
  Marketing: ['SEO', 'Campaigns', 'Content', 'Social', 'Conversion', 'Email', 'Branding', 'Analytics', 'Funnel', 'Ads'],
  Finance: ['FinTech', 'Crypto', 'Billing', 'Invoicing', 'Tax', 'Payments', 'Ledger', 'Portfolio', 'Risk', 'Banking'],
  Education: ['LMS', 'Courses', 'Quiz', 'Interactive', 'Certificates', 'Stem', 'Mentorship', 'E-Learning', 'Notes', 'Skills'],
  Health: ['Telemetry', 'Fitness', 'Wellness', 'Nutrition', 'Mental', 'Trackers', 'Biometrics', 'Sleep', 'Care', 'HealthAI'],
  Entertainment: ['Streaming', 'Audio', 'Gaming', 'AR/VR', 'Media', 'Podcasts', 'Community', 'Interactive', 'Video', '3D']
};

const CATEGORY_IMAGES = {
  Technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80'
  ],
  Design: [
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542744094-3a31b272c490?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=500&auto=format&fit=crop&q=80'
  ],
  Business: [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=80'
  ],
  Marketing: [
    'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&auto=format&fit=crop&q=80'
  ],
  Finance: [
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&auto=format&fit=crop&q=80'
  ],
  Education: [
    'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=80'
  ],
  Health: [
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=80'
  ],
  Entertainment: [
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=80'
  ]
};

// Seeded pseudo-random number generator for deterministic dataset
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateItems(count = 1250) {
  const items = [];
  let seed = 42;

  for (let i = 1; i <= count; i++) {
    const prefix = PREFIXES[Math.floor(seededRandom(seed++) * PREFIXES.length)];
    const noun = NOUNS[Math.floor(seededRandom(seed++) * NOUNS.length)];
    const suffix = SUFFIXES[Math.floor(seededRandom(seed++) * SUFFIXES.length)];
    const category = CATEGORIES[(i - 1) % CATEGORIES.length];

    const name = `${prefix} ${noun} ${suffix}`;
    const status = STATUSES[Math.floor(seededRandom(seed++) * STATUSES.length)];
    const price = Math.floor(seededRandom(seed++) * 980) + 19; // $19 to $999
    const rating = Number((3.5 + seededRandom(seed++) * 1.5).toFixed(1)); // 3.5 to 5.0

    const availableTags = CATEGORY_TAGS[category];
    const tagCount = 3;
    const itemTags = [];
    for (let t = 0; t < tagCount; t++) {
      const tagIndex = Math.floor(seededRandom(seed++) * availableTags.length);
      const tag = availableTags[tagIndex];
      if (!itemTags.includes(tag)) itemTags.push(tag);
    }
    if (itemTags.length < 2) itemTags.push('Performance');

    const images = CATEGORY_IMAGES[category];
    const image = images[i % images.length];

    const daysAgo = Math.floor(seededRandom(seed++) * 900);
    const dateObj = new Date(2026, 7, 1);
    dateObj.setDate(dateObj.getDate() - daysAgo);
    const createdAt = dateObj.toISOString();

    const descriptions = [
      `High-speed ${category.toLowerCase()} solution engineered for ultra-responsive React state management and low latency execution.`,
      `Modern ${category.toLowerCase()} platform optimized for seamless workflow integration, data visualization, and instant metrics.`,
      `Enterprise-grade ${category.toLowerCase()} system delivering enterprise reliability, zero bundle overhead, and fluid interactions.`,
      `Next-generation ${category.toLowerCase()} asset crafted with precision micro-interactions, responsive scale, and smart memoization.`
    ];
    const description = descriptions[i % descriptions.length];

    items.push({
      id: i,
      name,
      category,
      description,
      image,
      rating,
      status,
      price,
      tags: itemTags,
      createdAt,
      isFavorite: i <= 45 || i % 25 === 0,
      metrics: {
        views: Math.floor(seededRandom(seed++) * 15000) + 120,
        downloads: Math.floor(seededRandom(seed++) * 4200) + 15,
        renderCostMs: Number((seededRandom(seed++) * 0.4 + 0.1).toFixed(2)),
        memoSavedCount: Math.floor(seededRandom(seed++) * 300) + 10
      }
    });
  }

  return items;
}

export const INITIAL_ITEMS = generateItems(1250);
