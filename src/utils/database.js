const sqlite3 = require('sqlite3').verbose();
const config = require('../config/config');
const logger = require('./logger');

const db = new sqlite3.Database(config.dbPath, (err) => {
  if (err) logger.error('Error connecting to SQLite database:', err);
  else logger.info('Connected to SQLite database');
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      jid TEXT,
      message TEXT,
      timestamp INTEGER
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS groups (
      jid TEXT PRIMARY KEY,
      metadata TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS warnings (
      jid TEXT,
      user TEXT,
      count INTEGER,
      PRIMARY KEY (jid, user)
    )
  `);
});

module.exports = db;