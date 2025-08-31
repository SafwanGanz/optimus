const config = require('../../config/config');

module.exports = {
  command: 'ping',
  description: 'Check bot response time',
  usage: `${config.prefix}ping`,
  execute: async (sock, message) => {
    const start = Date.now();
    await sock.sendMessage(message.key.remoteJid, { text: 'Pong!' }, {quoted: message});
    const end = Date.now();
    return sock.sendMessage(message.key.remoteJid, { text: `Response time: ${end - start}ms` }, {quoted: message});
  }
};