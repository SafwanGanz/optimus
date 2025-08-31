const db = require('./database');
const logger = require('./logger');

module.exports = {
  saveMessage: (key, message, timestamp) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT OR REPLACE INTO messages (id, jid, message, timestamp) VALUES (?, ?, ?, ?)',
        [key.id, key.remoteJid, JSON.stringify(message), timestamp],
        (err) => {
          if (err) {
            logger.error('Error saving message:', err);
            reject(err);
          } else resolve();
        }
      );
    });
  },
  getMessage: (key) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT message FROM messages WHERE id = ? AND jid = ?',
        [key.id, key.remoteJid],
        (err, row) => {
          if (err) {
            logger.error('Error retrieving message:', err);
            reject(err);
          } else resolve(row ? JSON.parse(row.message) : null);
        }
      );
    });
  },
  saveGroupMetadata: (jid, metadata) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT OR REPLACE INTO groups (jid, metadata) VALUES (?, ?)',
        [jid, JSON.stringify(metadata)],
        (err) => {
          if (err) {
            logger.error('Error saving group metadata:', err);
            reject(err);
          } else resolve();
        }
      );
    });
  },
  getGroupMetadata: (jid) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT metadata FROM groups WHERE jid = ?',
        [jid],
        (err, row) => {
          if (err) {
            logger.error('Error retrieving group metadata:', err);
            reject(err);
          } else resolve(row ? JSON.parse(row.metadata) : null);
        }
      );
    });
  },
  saveWarning: (jid, user, count) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT OR REPLACE INTO warnings (jid, user, count) VALUES (?, ?, ?)',
        [jid, user, count],
        (err) => {
          if (err) {
            logger.error('Error saving warning:', err);
            reject(err);
          } else resolve();
        }
      );
    });
  },
  getWarning: (jid, user) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT count FROM warnings WHERE jid = ? AND user = ?',
        [jid, user],
        (err, row) => {
          if (err) {
            logger.error('Error retrieving warning:', err);
            reject(err);
          } else resolve(row ? row.count : 0);
        }
      );
    });
  }
};