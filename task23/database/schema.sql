-- Database Schema for OrderSphere - Customer Order Intelligence (SQLite / PostgreSQL Compatible)

-- Enable Foreign Keys
PRAGMA foreign_keys = ON;

-- Table 1: Customers
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar TEXT,
    city TEXT,
    country TEXT,
    customer_type TEXT DEFAULT 'Regular', -- 'New', 'Regular', 'Premium'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: Orders (Relational Foreign Key -> Customers.id)
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    order_number TEXT UNIQUE NOT NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'Pending', -- 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
    payment_status TEXT DEFAULT 'Paid', -- 'Paid', 'Pending', 'Failed', 'Refunded'
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    shipping_city TEXT NOT NULL
);

-- Table 3: Search Logs (For Search Intelligence Analytics)
CREATE TABLE IF NOT EXISTS search_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query TEXT NOT NULL,
    results_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table 4: FTS5 Full-Text Search Virtual Table across Joined Fields
CREATE VIRTUAL TABLE IF NOT EXISTS orders_fts USING fts5(
    order_id UNINDEXED,
    customer_id UNINDEXED,
    order_number,
    product_name,
    category,
    shipping_city,
    status,
    payment_status,
    customer_name,
    customer_email,
    customer_city,
    customer_country,
    tokenize = 'porter unicode61'
);
