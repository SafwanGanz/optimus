const store = require('../utils/store');

module.exports = (sock) => {
  sock.ev.on('groups.update', async ([event]) => {
    const metadata = await sock.groupMetadata(event.id);
    await store.saveGroupMetadata(event.id, metadata);
  });
};