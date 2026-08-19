// Server-side authoritative product definitions
// Client NEVER specifies amount/prices directly to prevent security vulnerabilities.

const PRODUCTS = {
  starter: {
    id: "starter",
    name: "Starter Flow",
    category: "Personal & Freelance",
    badge: "Popular for Starters",
    popular: false,
    price: 19,
    priceInCents: 1900,
    currency: "usd",
    rating: 4.8,
    reviewsCount: 142,
    description: "Ideal for individual developers, creators, and freelancers starting their payment collection journey.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
    gradient: "from-blue-500 to-cyan-400",
    features: [
      "Up to $10,000 monthly volume",
      "Standard payment processing",
      "Stripe Checkout Hosted Page",
      "Basic Analytics & Dashboard",
      "Email & Community Support",
      "SSL 256-bit Encrypted Security"
    ],
    stripePriceId: process.env.STRIPE_PRICE_STARTER || null
  },
  pro: {
    id: "pro",
    name: "Pro Flow",
    category: "Growing Business",
    badge: "Most Popular",
    popular: true,
    price: 49,
    priceInCents: 4900,
    currency: "usd",
    rating: 4.9,
    reviewsCount: 389,
    description: "Built for scaling startups and fast-growing teams requiring advanced metrics and instant payouts.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    gradient: "from-blue-600 to-orange-500",
    features: [
      "Up to $100,000 monthly volume",
      "Priority 24/7 Stripe settlement",
      "Custom branded checkout experience",
      "Advanced Revenue & Conversion Analytics",
      "Multi-currency support (135+ currencies)",
      "Priority Dedicated Support"
    ],
    stripePriceId: process.env.STRIPE_PRICE_PRO || null
  },
  business: {
    id: "business",
    name: "Business Scale",
    category: "Established Companies",
    badge: "High Growth",
    popular: false,
    price: 99,
    priceInCents: 9900,
    currency: "usd",
    rating: 5.0,
    reviewsCount: 215,
    description: "Comprehensive financial infrastructure designed for high-volume transactions and automated workflows.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    gradient: "from-orange-500 to-amber-500",
    features: [
      "Unlimited monthly volume",
      "Custom webhook notifications & automations",
      "Role-based access & team management",
      "Real-time fraud prevention & Radar AI",
      "Dedicated account manager",
      "99.99% Uptime Guarantee SLA"
    ],
    stripePriceId: process.env.STRIPE_PRICE_BUSINESS || null
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise Flow",
    category: "Global Platforms",
    badge: "Custom Solutions",
    popular: false,
    price: 199,
    priceInCents: 19900,
    currency: "usd",
    rating: 5.0,
    reviewsCount: 97,
    description: "Maximum control, custom SLA, compliance tools, and bespoke payment gateway configuration.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    gradient: "from-blue-700 via-indigo-600 to-orange-600",
    features: [
      "Custom interchange volume rates",
      "Direct API & custom checkout SDK",
      "Dedicated compliance & PCI audit assistance",
      "1-on-1 Stripe integration engineering",
      "Custom analytics report exports",
      "24/7 Phone & Slack VIP support"
    ],
    stripePriceId: process.env.STRIPE_PRICE_ENTERPRISE || null
  }
};

module.exports = PRODUCTS;
