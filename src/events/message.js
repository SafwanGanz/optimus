const { getText } = require('../utils/message');
const store = require('../utils/store');
const commandHandler = require('../services/commandHandler');
const logger = require('../utils/logger');

module.exports = (sock) => {
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    
    for (const m of messages) {
      if (!m.message) continue;
      
      await store.saveMessage(m.key, m.message, m.messageTimestamp);
      
      const text = getText(m.message);
      
      let sender = m.key.remoteJid;
      const isGroup = sender.endsWith('@g.us');
      const senderName = m.pushName || sender.split('@')[0];
      
      let msgType = 'unknown';
      if (m.message.conversation) msgType = 'text';
      else if (m.message.imageMessage) msgType = 'image';
      else if (m.message.videoMessage) msgType = 'video';
      else if (m.message.audioMessage) msgType = 'audio';
      else if (m.message.documentMessage) msgType = 'document';
      else if (m.message.stickerMessage) msgType = 'sticker';
      else if (m.message.contactMessage) msgType = 'contact';
      else if (m.message.locationMessage) msgType = 'location';
      
      if (isGroup) {
        const participant = m.key.participant?.split('@')[0] || 'unknown';
        logger.info(`📩 [GROUP: ${sender.split('@')[0]}] ${participant} (${senderName}): ${text ? text.substring(0, 60) : `[${msgType}]`}${text && text.length > 60 ? '...' : ''}`);
      } else {
        logger.info(`📩 [DIRECT] ${senderName} (${sender.split('@')[0]}): ${text ? text.substring(0, 60) : `[${msgType}]`}${text && text.length > 60 ? '...' : ''}`);
      }
      
      if (text) await commandHandler.handle(sock, m, text);
    }
  });
};
