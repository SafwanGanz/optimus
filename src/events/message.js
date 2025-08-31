const { getText } = require('../utils/message');
const store = require('../utils/store');
const commandHandler = require('../services/commandHandler');

module.exports = (sock) => {
  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const m of messages) {
      if (!m.message) continue;
      await store.saveMessage(m.key, m.message, m.messageTimestamp);
      const text = getText(m.message);
      if (text) await commandHandler.handle(sock, m, text);
    }
  });
};