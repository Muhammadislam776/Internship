const { getJoinedOrders, getOrderById } = require('../queries/orderQueries');
const { query } = require('../config/db');

async function handleGetOrders(req, res) {
  try {
    const {
      q,
      status,
      payment_status,
      customer_type,
      category,
      min_amount,
      max_amount,
      date_range,
      sort_by,
      page,
      limit
    } = req.query;

    const result = await getJoinedOrders({
      q,
      status,
      payment_status,
      customer_type,
      category,
      min_amount,
      max_amount,
      date_range,
      sort_by,
      page,
      limit
    });

    // If search term was provided, log it to search_logs table
    if (q && q.trim().length > 1) {
      try {
        await query(
          'INSERT INTO search_logs (query, results_count) VALUES ($1, $2)',
          [q.trim(), result.total]
        );
      } catch (err) {
        console.error('Failed to log search query:', err.message);
      }
    }

    res.json({
      success: true,
      data: result.orders,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      }
    });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch joined orders', error: err.message });
  }
}

async function handleGetOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = await getOrderById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Generate timeline stages for order status animation
    const stages = ['Order Placed', 'Payment Confirmed', 'Processing', 'Shipped', 'Delivered'];
    let currentStageIndex = 0;
    if (order.status === 'Pending') currentStageIndex = 0;
    else if (order.status === 'Processing') currentStageIndex = 2;
    else if (order.status === 'Shipped') currentStageIndex = 3;
    else if (order.status === 'Delivered') currentStageIndex = 4;
    else if (order.status === 'Cancelled') currentStageIndex = -1;

    const timeline = stages.map((label, idx) => ({
      label,
      completed: currentStageIndex >= idx && currentStageIndex !== -1,
      current: currentStageIndex === idx,
      cancelled: order.status === 'Cancelled'
    }));

    res.json({
      success: true,
      data: {
        ...order,
        timeline
      }
    });
  } catch (err) {
    console.error('Error fetching order by ID:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch order details', error: err.message });
  }
}

module.exports = {
  handleGetOrders,
  handleGetOrderById
};
