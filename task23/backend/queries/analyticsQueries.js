const { query } = require('../config/db');

async function getAnalyticsOverview() {
  // 1. KPI Summary Cards
  const kpiSql = `
    SELECT
      (SELECT COUNT(*) FROM orders) AS total_orders,
      (SELECT COUNT(*) FROM customers) AS total_customers,
      (SELECT COALESCE(SUM(amount), 0) FROM orders WHERE status != 'Cancelled') AS total_revenue,
      (SELECT COUNT(*) FROM orders WHERE status IN ('Pending', 'Processing')) AS pending_orders,
      (SELECT COUNT(*) FROM orders WHERE status = 'Delivered') AS delivered_orders,
      (SELECT COALESCE(AVG(amount), 0) FROM orders WHERE status != 'Cancelled') AS avg_order_value
  `;
  const kpiRes = await query(kpiSql);
  const kpi = kpiRes.rows[0];

  // 2. Revenue & Orders Over Time (Monthly aggregation)
  const timelineSql = `
    SELECT 
      strftime('%Y-%m', order_date) AS month_key,
      strftime('%m/%Y', order_date) AS month_label,
      COUNT(id) AS orders_count,
      ROUND(SUM(amount), 2) AS revenue
    FROM orders
    WHERE status != 'Cancelled'
    GROUP BY month_key
    ORDER BY month_key ASC
    LIMIT 12
  `;
  const timelineRes = await query(timelineSql);

  // 3. Orders By Status Distribution
  const statusSql = `
    SELECT 
      status,
      COUNT(id) AS count,
      ROUND(SUM(amount), 2) AS revenue
    FROM orders
    GROUP BY status
    ORDER BY count DESC
  `;
  const statusRes = await query(statusSql);

  // 4. Orders By Category Distribution
  const categorySql = `
    SELECT 
      category,
      COUNT(id) AS count,
      ROUND(SUM(amount), 2) AS revenue
    FROM orders
    GROUP BY category
    ORDER BY revenue DESC
  `;
  const categoryRes = await query(categorySql);

  // 5. Customers By Location (Top Cities & Countries)
  const locationSql = `
    SELECT 
      c.country,
      c.city,
      COUNT(DISTINCT c.id) AS customer_count,
      COUNT(o.id) AS total_orders,
      ROUND(SUM(o.amount), 2) AS total_spent
    FROM customers c
    LEFT JOIN orders o ON o.customer_id = c.id
    GROUP BY c.country, c.city
    ORDER BY customer_count DESC, total_spent DESC
    LIMIT 8
  `;
  const locationRes = await query(locationSql);

  return {
    kpis: {
      totalOrders: parseInt(kpi.total_orders, 10),
      totalCustomers: parseInt(kpi.total_customers, 10),
      totalRevenue: parseFloat(kpi.total_revenue),
      pendingOrders: parseInt(kpi.pending_orders, 10),
      deliveredOrders: parseInt(kpi.delivered_orders, 10),
      avgOrderValue: parseFloat(kpi.avg_order_value)
    },
    timeline: timelineRes.rows,
    statusBreakdown: statusRes.rows,
    categoryBreakdown: categoryRes.rows,
    locationBreakdown: locationRes.rows
  };
}

module.exports = {
  getAnalyticsOverview
};
