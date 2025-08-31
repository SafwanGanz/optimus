const { isGroup } = require('../../utils/message');
const config = require('../../config/config');

module.exports = {
  command: 'info',
  description: 'Get group information',
  usage: `${config.prefix}info`,
  execute: async (sock, message) => {
    const jid = message.key.remoteJid;
    if (!isGroup(jid)) return sock.sendMessage(jid, { text: 'Command only works in groups.' }, {quoted: message});
    
    const metadata = await sock.groupMetadata(jid);
    const info = `Group Info\nName: ${metadata.subject}\nID: ${metadata.id}\nParticipants: ${metadata.participants.length}\nDescription: ${metadata.desc || 'None'}`;
    return sock.sendMessage(jid, { text: info }, {quoted: message});
  }
};