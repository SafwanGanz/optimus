const { getContentType } = require('@whiskeysockets/baileys');

module.exports = {
  getText: (message) => {
    const type = getContentType(message);
    return type === 'conversation' ? message.conversation :
           type === 'extendedTextMessage' ? message.extendedTextMessage.text : '';
  },
  isGroup: (jid) => jid.endsWith('@g.us'),
  isAdmin: async (sock, jid, user) => {
    const metadata = await sock.groupMetadata(jid);
    const participant = metadata.participants.find(p => p.id === user);
    return participant && (participant.admin === 'admin' || participant.admin === 'superadmin');
  },
  formatJid: (number) => {
    number = number.replace(/[^0-9]/g, '');
    if (!number.startsWith('+')) number = '+' + number;
    return number + '@s.whatsapp.net';
  }
};