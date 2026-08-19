const fs = require('fs');
const path = require('path');

const firstNames = [
  'John', 'Sarah', 'Ali', 'Michael', 'Emma', 'David', 'Sophia', 'James', 'Emily', 'Daniel',
  'Olivia', 'Alexander', 'Avani', 'Liam', 'Isabella', 'Benjamin', 'Mia', 'Lucas', 'Charlotte', 'Ethan',
  'Amara', 'Henry', 'Harper', 'Sebastian', 'Evelyn', 'Jack', 'Abigail', 'Owen', 'Ella', 'Jackson',
  'Avery', 'Aiden', 'Scarlett', 'Matthew', 'Grace', 'Samuel', 'Chloe', 'Ryan', 'Victoria', 'Nathan',
  'Riley', 'Caleb', 'Aria', 'Andrew', 'Lily', 'Joshua', 'Aubrey', 'Christopher', 'Zoey', 'Ezekiel',
  'Tariq', 'Fatima', 'Yusuf', 'Aisha', 'Zain', 'Mariam', 'Bilal', 'Zahra', 'Omar', 'Nadia',
  'Hiroshi', 'Yuki', 'Kenji', 'Sakura', 'Ren', 'Hana', 'Sora', 'Aoi', 'Kaito', 'Mei',
  'Mateo', 'Sofia', 'Santiago', 'Valentina', 'Carlos', 'Camila', 'Diego', 'Isabella', 'Javier', 'Elena',
  'Lukas', 'Freja', 'Felix', 'Astrid', 'Erik', 'Linnea', 'Oliver', 'Maja', 'Axel', 'Ida'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Khan', 'Ahmed', 'Ali', 'Hussain', 'Shah', 'Malik', 'Chaudhry', 'Siddiqui', 'Rehman', 'Ansari',
  'Tanaka', 'Sato', 'Suzuki', 'Takahashi', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato',
  'Silva', 'Santos', 'Ferreira', 'Oliveira', 'Costa', 'Rodrigues', 'Martins', 'Sousa', 'Fernandes', 'Gomes'
];

const citiesCountries = [
  { city: 'New York', country: 'United States' },
  { city: 'San Francisco', country: 'United States' },
  { city: 'London', country: 'United Kingdom' },
  { city: 'Toronto', country: 'Canada' },
  { city: 'Sydney', country: 'Australia' },
  { city: 'Berlin', country: 'Germany' },
  { city: 'Tokyo', country: 'Japan' },
  { city: 'Paris', country: 'France' },
  { city: 'Chicago', country: 'United States' },
  { city: 'Singapore', country: 'Singapore' },
  { city: 'Dubai', country: 'United Arab Emirates' },
  { city: 'Amsterdam', country: 'Netherlands' },
  { city: 'Seoul', country: 'South Korea' },
  { city: 'Los Angeles', country: 'United States' },
  { city: 'Melbourne', country: 'Australia' },
  { city: 'Vancouver', country: 'Canada' },
  { city: 'Stockholm', country: 'Sweden' },
  { city: 'Dublin', country: 'Ireland' },
  { city: 'Austin', country: 'United States' },
  { city: 'Seattle', country: 'United States' },
  { city: 'Boston', country: 'United States' },
  { city: 'Zurich', country: 'Switzerland' },
  { city: 'Madrid', country: 'Spain' },
  { city: 'Lisbon', country: 'Portugal' }
];

const products = [
  {
    name: 'Wireless Noise-Canceling Headphones Pro',
    category: 'Electronics',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'
  },
  {
    name: 'Ultra-Wide Curved Monitor 34"',
    category: 'Electronics',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80'
  },
  {
    name: 'Smart Watch Ultra Edition',
    category: 'Electronics',
    price: 329.50,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'
  },
  {
    name: 'Mechanical RGB Wireless Keyboard',
    category: 'Electronics',
    price: 139.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80'
  },
  {
    name: 'Ergonomic Precision Mouse',
    category: 'Electronics',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80'
  },
  {
    name: 'Studio Condenser USB Microphone',
    category: 'Audio',
    price: 179.00,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80'
  },
  {
    name: 'Portable Waterproof Bluetooth Speaker',
    category: 'Audio',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80'
  },
  {
    name: '4K Ultra HD Streaming Webcam Pro',
    category: 'Electronics',
    price: 149.95,
    image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500&q=80'
  },
  {
    name: 'Ergonomic Mesh Executive Chair',
    category: 'Home & Office',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?w=500&q=80'
  },
  {
    name: 'Electric Standing Desk 60"',
    category: 'Home & Office',
    price: 479.00,
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=500&q=80'
  },
  {
    name: 'Full-Grain Leather Laptop Sleeve',
    category: 'Accessories',
    price: 79.50,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80'
  },
  {
    name: 'Anti-Theft Travel Backpack 30L',
    category: 'Accessories',
    price: 109.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80'
  },
  {
    name: 'Performance Nitro Running Shoes',
    category: 'Apparel',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'
  },
  {
    name: 'Minimalist White Leather Sneakers',
    category: 'Apparel',
    price: 129.00,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80'
  },
  {
    name: 'Waterproof All-Weather Trail Jacket',
    category: 'Apparel',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&q=80'
  },
  {
    name: 'Smart HEPA Air Purifier Pro',
    category: 'Home & Office',
    price: 219.00,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80'
  },
  {
    name: 'Compact Deep Tissue Massage Gun',
    category: 'Fitness',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80'
  },
  {
    name: 'Smart Digital Counter Jump Rope',
    category: 'Fitness',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&q=80'
  },
  {
    name: 'Polarized Aviator Sunglasses',
    category: 'Accessories',
    price: 94.50,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80'
  },
  {
    name: 'Insulated Stainless Steel Bottle 1L',
    category: 'Fitness',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80'
  }
];

const customerTypes = ['New', 'Regular', 'Premium'];
const orderStatuses = ['Delivered', 'Delivered', 'Delivered', 'Shipped', 'Processing', 'Pending', 'Cancelled'];
const paymentStatuses = ['Paid', 'Paid', 'Paid', 'Pending', 'Failed', 'Refunded'];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(startDaysAgo, endDaysAgo) {
  const now = new Date('2026-08-19T08:00:00Z');
  const startMs = now.getTime() - startDaysAgo * 24 * 60 * 60 * 1000;
  const endMs = now.getTime() - endDaysAgo * 24 * 60 * 60 * 1000;
  const targetMs = startMs + Math.random() * (endMs - startMs);
  return new Date(targetMs).toISOString().replace('T', ' ').substring(0, 19);
}

function escapeSQL(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/'/g, "''");
}

function generateSeedSQL() {
  console.log('Generating seed data: 550 customers, 1600 orders...');
  let sql = `-- OrderSphere Seed Data
-- 550 Customers & 1600 Orders

DELETE FROM orders_fts;
DELETE FROM orders;
DELETE FROM customers;
DELETE FROM search_logs;

-- Insert Customers
INSERT INTO customers (id, name, email, phone, avatar, city, country, customer_type, created_at) VALUES
`;

  const customersMap = new Map();
  const usedEmails = new Set();

  for (let i = 1; i <= 550; i++) {
    const fn = randomChoice(firstNames);
    const ln = randomChoice(lastNames);
    const name = `${fn} ${ln}`;
    let email = `${fn.toLowerCase()}.${ln.toLowerCase()}${randomInt(1, 999)}@${randomChoice(['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'company.io', 'techcorp.org'])}`;
    while (usedEmails.has(email)) {
      email = `${fn.toLowerCase()}.${ln.toLowerCase()}${randomInt(1000, 99999)}@${randomChoice(['gmail.com', 'outlook.com', 'company.io'])}`;
    }
    usedEmails.add(email);

    const loc = randomChoice(citiesCountries);
    const phone = `+1 (${randomInt(200, 999)}) ${randomInt(100, 999)}-${randomInt(1000, 9999)}`;
    const avatar = `https://images.unsplash.com/photo-${randomChoice([
      '1534528741775-53994a69daeb',
      '1507003211169-0a1dd7228f2d',
      '1494790108377-be9c29b29330',
      '1500648767791-00dcc994a43e',
      '1438761681033-6461ffad8d80',
      '1472099645785-5658abf4ff4e',
      '1544005313-94ddf0286df2',
      '1519085360753-af0119f7cbe7',
      '1539571696357-5a69c17a67c6',
      '1517841905240-472988babdf9',
      '1524504388940-b1c1722653e1',
      '1506794778202-cad84cf45f1d',
      '1522075469751-3a6694fb2f61',
      '1573496359142-b8d87734a5a2',
      '1580489944761-15a19d654956'
    ])}?w=150&auto=format&fit=crop&q=80`;
    
    const customerType = randomChoice(customerTypes);
    const createdAt = randomDate(365, 30);

    customersMap.set(i, { id: i, name, email, city: loc.city, country: loc.country });
    sql += `(${i}, '${escapeSQL(name)}', '${escapeSQL(email)}', '${phone}', '${avatar}', '${escapeSQL(loc.city)}', '${escapeSQL(loc.country)}', '${customerType}', '${createdAt}')`;
    if (i < 550) {
      sql += `,\n`;
    } else {
      sql += `;\n\n`;
    }
  }

  // Insert Orders
  sql += `INSERT INTO orders (id, customer_id, order_number, product_name, product_image, category, amount, status, payment_status, order_date, shipping_city) VALUES\n`;

  const orderCount = 1600;
  const ordersList = [];

  for (let i = 1; i <= orderCount; i++) {
    const custId = randomInt(1, 550);
    const cust = customersMap.get(custId);
    const prod = randomChoice(products);
    const orderNum = `#ORD-${10000 + i}`;
    
    const qty = randomChoice([1, 1, 1, 2, 3]);
    const amount = (prod.price * qty).toFixed(2);
    
    const status = randomChoice(orderStatuses);
    const paymentStatus = status === 'Cancelled' ? randomChoice(['Failed', 'Refunded']) : (status === 'Pending' ? randomChoice(['Pending', 'Paid']) : 'Paid');
    const orderDate = randomDate(180, 0);
    const shippingCity = cust.city;

    ordersList.push({
      id: i,
      customer_id: cust.id,
      order_number: orderNum,
      product_name: prod.name,
      category: prod.category,
      shipping_city: shippingCity,
      status,
      payment_status: paymentStatus,
      customer_name: cust.name,
      customer_email: cust.email,
      customer_city: cust.city,
      customer_country: cust.country
    });

    sql += `(${i}, ${cust.id}, '${orderNum}', '${escapeSQL(prod.name)}', '${prod.image}', '${escapeSQL(prod.category)}', ${amount}, '${status}', '${paymentStatus}', '${orderDate}', '${escapeSQL(shippingCity)}')`;
    if (i < orderCount) {
      sql += `,\n`;
    } else {
      sql += `;\n\n`;
    }
  }

  // Populate FTS5 table
  sql += `INSERT INTO orders_fts (order_id, customer_id, order_number, product_name, category, shipping_city, status, payment_status, customer_name, customer_email, customer_city, customer_country) VALUES\n`;
  for (let i = 0; i < ordersList.length; i++) {
    const o = ordersList[i];
    sql += `(${o.id}, ${o.customer_id}, '${escapeSQL(o.order_number)}', '${escapeSQL(o.product_name)}', '${escapeSQL(o.category)}', '${escapeSQL(o.shipping_city)}', '${escapeSQL(o.status)}', '${escapeSQL(o.payment_status)}', '${escapeSQL(o.customer_name)}', '${escapeSQL(o.customer_email)}', '${escapeSQL(o.customer_city)}', '${escapeSQL(o.customer_country)}')`;
    if (i < ordersList.length - 1) {
      sql += `,\n`;
    } else {
      sql += `;\n\n`;
    }
  }

  // Add initial search log seeds
  sql += `INSERT INTO search_logs (query, results_count, created_at) VALUES
('headphones', 84, DATETIME('now', '-2 hours')),
('john@example.com', 1, DATETIME('now', '-4 hours')),
('ORD-10482', 1, DATETIME('now', '-6 hours')),
('London', 112, DATETIME('now', '-12 hours')),
('Delivered', 1032, DATETIME('now', '-1 day')),
('Electronics', 420, DATETIME('now', '-2 days'));
`;

  const targetPath = path.join(__dirname, '../../database/seed.sql');
  fs.writeFileSync(targetPath, sql, 'utf8');
  console.log(`Successfully written seed.sql to ${targetPath}`);
}

generateSeedSQL();
