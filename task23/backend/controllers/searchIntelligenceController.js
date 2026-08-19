const { query } = require('../config/db');

async function handleGetSearchIntelligence(req, res) {
  try {
    // 1. Total search count
    const totalRes = await query('SELECT COUNT(*) AS total FROM search_logs');
    const totalSearches = parseInt(totalRes.rows[0]?.total || 0, 10);

    // 2. Total matches found overall
    const resultsRes = await query('SELECT COALESCE(SUM(results_count), 0) AS total_results FROM search_logs');
    const totalResultsFound = parseInt(resultsRes.rows[0]?.total_results || 0, 10);

    // 3. No result searches
    const noResultsRes = await query('SELECT COUNT(*) AS no_results FROM search_logs WHERE results_count = 0');
    const noResultSearches = parseInt(noResultsRes.rows[0]?.no_results || 0, 10);

    // 4. Most searched query
    const topTermRes = await query(`
      SELECT query, COUNT(*) AS search_count, AVG(results_count) AS avg_results
      FROM search_logs
      GROUP BY query
      ORDER BY search_count DESC
      LIMIT 1
    `);
    const mostSearched = topTermRes.rows[0]?.query || 'headphones';

    // 5. Popular Search Keywords (Top 6)
    const popularQueriesRes = await query(`
      SELECT query, COUNT(*) AS count, MAX(results_count) AS max_results
      FROM search_logs
      GROUP BY query
      ORDER BY count DESC, max_results DESC
      LIMIT 6
    `);

    // 6. Recent Searches Stream (Latest 15)
    const recentSearchesRes = await query(`
      SELECT id, query, results_count, created_at
      FROM search_logs
      ORDER BY created_at DESC
      LIMIT 15
    `);

    res.json({
      success: true,
      data: {
        totalSearches,
        mostSearched,
        totalResultsFound,
        noResultSearches,
        popularQueries: popularQueriesRes.rows,
        recentSearches: recentSearchesRes.rows
      }
    });
  } catch (err) {
    console.error('Error fetching search intelligence:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch search intelligence', error: err.message });
  }
}

async function handleLogSearch(req, res) {
  try {
    const { query: searchQuery, resultsCount = 0 } = req.body;
    if (!searchQuery || typeof searchQuery !== 'string') {
      return res.status(400).json({ success: false, message: 'Search query string is required' });
    }

    const insertRes = await query(
      'INSERT INTO search_logs (query, results_count) VALUES ($1, $2) RETURNING *',
      [searchQuery.trim(), parseInt(resultsCount, 10) || 0]
    );

    res.json({
      success: true,
      data: insertRes.rows[0]
    });
  } catch (err) {
    console.error('Error logging search query:', err);
    res.status(500).json({ success: false, message: 'Failed to log search query', error: err.message });
  }
}

module.exports = {
  handleGetSearchIntelligence,
  handleLogSearch
};
