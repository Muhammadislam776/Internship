const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

let dbInstance = null;

function initDB() {
  if (dbInstance) return dbInstance;

  const dbPath = path.join(__dirname, '../../database/ordersphere.db');
  console.log(`⚡ Initializing SQLite Database at ${dbPath}...`);
  
  dbInstance = new Database(dbPath);
  dbInstance.pragma('foreign_keys = ON');

  // Check if customers table exists
  const tableCheck = dbInstance.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='customers'").get();
  
  if (!tableCheck) {
    console.log('📜 Creating Database Schema...');
    const schemaSql = fs.readFileSync(path.join(__dirname, '../../database/schema.sql'), 'utf8');
    dbInstance.exec(schemaSql);

    console.log('📜 Creating Database Indexes...');
    const indexesSql = fs.readFileSync(path.join(__dirname, '../../database/indexes.sql'), 'utf8');
    dbInstance.exec(indexesSql);

    console.log('🌱 Seeding 550 Customers & 1600 Orders with FTS5...');
    const seedSql = fs.readFileSync(path.join(__dirname, '../../database/seed.sql'), 'utf8');
    dbInstance.exec(seedSql);
  }

  const custCount = dbInstance.prepare('SELECT COUNT(*) AS count FROM customers').get();
  const orderCount = dbInstance.prepare('SELECT COUNT(*) AS count FROM orders').get();
  console.log(`✅ Database ready! Customers: ${custCount.count}, Orders: ${orderCount.count}`);

  return dbInstance;
}

function query(sql, params = []) {
  if (!dbInstance) {
    initDB();
  }

  const trimmed = sql.trim();
  const isSelect = trimmed.toUpperCase().startsWith('SELECT') || trimmed.toUpperCase().startsWith('WITH');

  if (isSelect) {
    const stmt = dbInstance.prepare(sql);
    const rows = stmt.all(...params);
    return { rows };
  } else {
    const stmt = dbInstance.prepare(sql);
    const result = stmt.run(...params);
    return { rows: [], changes: result.changes, lastInsertRowid: result.lastInsertRowid };
  }
}

module.exports = {
  initDB,
  query,
  getDB: () => dbInstance
};
