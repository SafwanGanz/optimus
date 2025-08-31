require('dotenv').config();

module.exports = {
  prefix: process.env.BOT_PREFIX || '!',
  dbPath: process.env.DB_PATH || './optimus_void.db',
  botName: process.env.BOT_NAME || 'Optimus-Void'
};