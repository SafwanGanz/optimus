const { getContentType } = require('@whiskeysockets/baileys');

module.exports = {
  getText: (message) => {
    const type = getContentType(message);
    return type === 'conversation' ? message.conversation :
           type === 'extendedTextMessage' ? message.extendedTextMessage.text : '';
  },
  isGroup: (jid) => jid.endsWith('@g.us'),
  isAdmin: async (sock, jid, user) => {
    try {
      const store = require('./store');
      const logger = require('./logger');
      
      let metadata = await store.getGroupMetadata(jid);
      
      if (!metadata) {
        try {
          metadata = await sock.groupMetadata(jid);
          await store.saveGroupMetadata(jid, metadata);
        } catch (error) {
          if (error.data === 429) {
            logger.warn(`Rate limit hit when checking admin status in ${jid}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
              metadata = await sock.groupMetadata(jid);
              await store.saveGroupMetadata(jid, metadata);
            } catch (retryError) {
              logger.error(`Failed to get group metadata after retry: ${retryError}`);
              return false;
            }
          } else if (error.data === 403) {
            logger.warn(`Forbidden: Cannot access metadata for group ${jid}`);
            return false;
          } else {
            logger.error(`Error checking admin status: ${error}`);
            return false;
          }
        }
      }
      
      if (!metadata || !metadata.participants) return false;
      
      const participant = metadata.participants.find(p => p.id === user);
      return !!(participant && (participant.admin === 'admin' || participant.admin === 'superadmin'));
    } catch (error) {
      console.error('[ERROR] isAdmin:', error);
      return false;
    }
  },
  formatJid: (number) => {
    number = number.replace(/[^0-9]/g, '');
    if (!number.startsWith('+')) number = '+' + number;
    return number + '@s.whatsapp.net';
  }
};
