-- Indexes for High Performance SQL JOIN & Searching

-- 1. Foreign Key Index on orders.customer_id for fast relational JOINs
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);

-- 2. Status, Payment, Date & Category indexes for fast filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date DESC);
CREATE INDEX IF NOT EXISTS idx_orders_category ON orders(category);
CREATE INDEX IF NOT EXISTS idx_customers_customer_type ON customers(customer_type);
