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
  db.run(`
    CREATE TABLE IF NOT EXISTS group_settings (
      jid TEXT PRIMARY KEY,
      welcome_enabled INTEGER DEFAULT 1
    )
  `);
});

module.exports = db;

const getWelcomeEnabled = (jid) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT welcome_enabled FROM group_settings WHERE jid = ?', [jid], (err, row) => {
      if (err) reject(err);
      else resolve(row ? row.welcome_enabled : 1);
    });
  });
};

const setWelcomeEnabled = (jid, enabled) => {
  return new Promise((resolve, reject) => {
    db.run('INSERT OR REPLACE INTO group_settings (jid, welcome_enabled) VALUES (?, ?)', [jid, enabled], function(err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
};

module.exports.getWelcomeEnabled = getWelcomeEnabled;
module.exports.setWelcomeEnabled = setWelcomeEnabled;
