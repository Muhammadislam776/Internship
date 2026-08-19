const { query } = require('../config/db');

async function handleGetCustomers(req, res) {
  try {
    const { search, customer_type, page = 1, limit = 12 } = req.query;

    const whereClauses = [];
    const params = [];

    if (search && search.trim()) {
      const s = search.trim();
      params.push(`%${s}%`);
      whereClauses.push(`(c.name ILIKE $${params.length} OR c.email ILIKE $${params.length} OR c.city ILIKE $${params.length} OR c.country ILIKE $${params.length})`);
    }

    if (customer_type) {
      params.push(customer_type);
      whereClauses.push(`c.customer_type = $${params.length}`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Count
    const countSql = `SELECT COUNT(*) AS total FROM customers c ${whereSql}`;
    const countRes = await query(countSql, params);
    const total = parseInt(countRes.rows[0]?.total || 0, 10);

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const offset = (pageNum - 1) * limitNum;

    // Fetch customers joined with order aggregates
    const dataParams = [...params, limitNum, offset];
    const sql = `
      SELECT 
        c.id,
        c.name,
        c.email,
        c.phone,
        c.avatar,
        c.city,
        c.country,
        c.customer_type,
        c.created_at,
        COUNT(o.id) AS total_orders,
        COALESCE(SUM(CASE WHEN o.status != 'Cancelled' THEN o.amount ELSE 0 END), 0) AS total_spent,
        COALESCE(AVG(CASE WHEN o.status != 'Cancelled' THEN o.amount ELSE NULL END), 0) AS avg_order_value,
        MAX(o.order_date) AS last_order_date
      FROM customers c
      LEFT JOIN orders o ON o.customer_id = c.id
      ${whereSql}
      GROUP BY c.id
      ORDER BY total_spent DESC
      LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}
    `;

    const dataRes = await query(sql, dataParams);

    res.json({
      success: true,
      data: dataRes.rows,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch customers', error: err.message });
  }
}

async function handleGetCustomerById(req, res) {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        c.id,
        c.name,
        c.email,
        c.phone,
        c.avatar,
        c.city,
        c.country,
        c.customer_type,
        c.created_at,
        COUNT(o.id) AS total_orders,
        COALESCE(SUM(CASE WHEN o.status != 'Cancelled' THEN o.amount ELSE 0 END), 0) AS total_spent,
        COALESCE(AVG(CASE WHEN o.status != 'Cancelled' THEN o.amount ELSE NULL END), 0) AS avg_order_value,
        MAX(o.order_date) AS last_order_date
      FROM customers c
      LEFT JOIN orders o ON o.customer_id = c.id
      WHERE c.id = $1
      GROUP BY c.id
    `;
    const resDb = await query(sql, [id]);

    if (!resDb.rows[0]) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({
      success: true,
      data: resDb.rows[0]
    });
  } catch (err) {
    console.error('Error fetching customer profile:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch customer profile', error: err.message });
  }
}

async function handleGetCustomerOrders(req, res) {
  try {
    const { id } = req.params;

    // Relational query demonstrating 1 Customer -> Multiple Orders relationship
    const sql = `
      SELECT 
        o.id,
        o.order_number,
        o.product_name,
        o.product_image,
        o.category,
        o.amount,
        o.status,
        o.payment_status,
        o.order_date,
        o.shipping_city,
        c.name AS customer_name,
        c.email AS customer_email
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE o.customer_id = $1
      ORDER BY o.order_date DESC
    `;

    const dataRes = await query(sql, [id]);

    res.json({
      success: true,
      customerId: parseInt(id, 10),
      totalOrders: dataRes.rows.length,
      data: dataRes.rows
    });
  } catch (err) {
    console.error('Error fetching customer order history:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch customer orders', error: err.message });
  }
}

module.exports = {
  handleGetCustomers,
  handleGetCustomerById,
  handleGetCustomerOrders
};
