const { getAnalyticsOverview } = require('../queries/analyticsQueries');

async function handleGetAnalytics(req, res) {
  try {
    const analyticsData = await getAnalyticsOverview();
    res.json({
      success: true,
      data: analyticsData
    });
  } catch (err) {
    console.error('Error fetching analytics overview:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics', error: err.message });
  }
}

module.exports = {
  handleGetAnalytics
};
