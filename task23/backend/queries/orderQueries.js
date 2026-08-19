const { query } = require('../config/db');

async function getJoinedOrders(options = {}) {
  const {
    q,
    status,
    payment_status,
    customer_type,
    category,
    min_amount,
    max_amount,
    date_range,
    sort_by = 'date_desc',
    page = 1,
    limit = 10
  } = options;

  const whereClauses = [];
  const params = [];

  // Full-Text Search across JOINED dataset
  if (q && q.trim()) {
    const rawSearch = q.trim();
    
    // Format query for FTS5 prefix matching e.g. "headph*" or "john* smith*"
    const ftsQuery = rawSearch
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .map(word => `${word}*`)
      .join(' ');

    const likePattern = `%${rawSearch}%`;

    params.push(ftsQuery || rawSearch);
    params.push(likePattern);
    params.push(likePattern);
    params.push(likePattern);
    params.push(likePattern);
    params.push(likePattern);
    params.push(likePattern);
    params.push(likePattern);

    whereClauses.push(`(
      o.id IN (SELECT order_id FROM orders_fts WHERE orders_fts MATCH ?)
      OR c.name LIKE ?
      OR c.email LIKE ?
      OR o.order_number LIKE ?
      OR o.product_name LIKE ?
      OR o.category LIKE ?
      OR o.shipping_city LIKE ?
      OR o.status LIKE ?
    )`);
  }

  // Filter: Status
  if (status) {
    const statusList = Array.isArray(status) ? status : status.split(',').map(s => s.trim()).filter(Boolean);
    if (statusList.length > 0) {
      const placeholders = statusList.map(s => {
        params.push(s);
        return '?';
      }).join(', ');
      whereClauses.push(`o.status IN (${placeholders})`);
    }
  }

  // Filter: Payment Status
  if (payment_status) {
    const payList = Array.isArray(payment_status) ? payment_status : payment_status.split(',').map(s => s.trim()).filter(Boolean);
    if (payList.length > 0) {
      const placeholders = payList.map(s => {
        params.push(s);
        return '?';
      }).join(', ');
      whereClauses.push(`o.payment_status IN (${placeholders})`);
    }
  }

  // Filter: Customer Type
  if (customer_type) {
    const typeList = Array.isArray(customer_type) ? customer_type : customer_type.split(',').map(s => s.trim()).filter(Boolean);
    if (typeList.length > 0) {
      const placeholders = typeList.map(s => {
        params.push(s);
        return '?';
      }).join(', ');
      whereClauses.push(`c.customer_type IN (${placeholders})`);
    }
  }

  // Filter: Category
  if (category) {
    const catList = Array.isArray(category) ? category : category.split(',').map(s => s.trim()).filter(Boolean);
    if (catList.length > 0) {
      const placeholders = catList.map(s => {
        params.push(s);
        return '?';
      }).join(', ');
      whereClauses.push(`o.category IN (${placeholders})`);
    }
  }

  // Filter: Amount Range
  if (min_amount) {
    params.push(parseFloat(min_amount));
    whereClauses.push(`o.amount >= ?`);
  }
  if (max_amount) {
    params.push(parseFloat(max_amount));
    whereClauses.push(`o.amount <= ?`);
  }

  // Filter: Date Range
  if (date_range) {
    if (date_range === 'today') {
      whereClauses.push(`o.order_date >= date('now')`);
    } else if (date_range === 'week') {
      whereClauses.push(`o.order_date >= date('now', '-7 days')`);
    } else if (date_range === 'month') {
      whereClauses.push(`o.order_date >= date('now', '-30 days')`);
    }
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Sorting
  let orderBySql = 'ORDER BY o.order_date DESC';
  if (sort_by === 'date_asc') orderBySql = 'ORDER BY o.order_date ASC';
  else if (sort_by === 'amount_desc') orderBySql = 'ORDER BY o.amount DESC';
  else if (sort_by === 'amount_asc') orderBySql = 'ORDER BY o.amount ASC';
  else if (sort_by === 'customer_asc') orderBySql = 'ORDER BY c.name ASC';
  else if (sort_by === 'customer_desc') orderBySql = 'ORDER BY c.name DESC';

  // Count Total Query
  const countSql = `
    SELECT COUNT(*) AS total
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    ${whereSql}
  `;
  const countRes = await query(countSql, params);
  const total = parseInt(countRes.rows[0]?.total || 0, 10);

  // Pagination
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const offset = (pageNum - 1) * limitNum;

  const dataParams = [...params, limitNum, offset];
  const dataSql = `
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
      c.id AS customer_id,
      c.name AS customer_name,
      c.email AS customer_email,
      c.phone AS customer_phone,
      c.avatar AS customer_avatar,
      c.city AS customer_city,
      c.country AS customer_country,
      c.customer_type,
      c.created_at AS customer_created_at
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    ${whereSql}
    ${orderBySql}
    LIMIT ? OFFSET ?
  `;

  const dataRes = await query(dataSql, dataParams);

  return {
    orders: dataRes.rows,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum) || 1
  };
}

async function getOrderById(orderId) {
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
      c.id AS customer_id,
      c.name AS customer_name,
      c.email AS customer_email,
      c.phone AS customer_phone,
      c.avatar AS customer_avatar,
      c.city AS customer_city,
      c.country AS customer_country,
      c.customer_type,
      c.created_at AS customer_created_at
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    WHERE o.id = ?
  `;
  const res = await query(sql, [orderId]);
  return res.rows[0] || null;
}

module.exports = {
  getJoinedOrders,
  getOrderById
};
