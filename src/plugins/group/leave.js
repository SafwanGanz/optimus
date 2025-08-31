const { isGroup, isAdmin } = require('../../utils/message');
const config = require('../../config/config');

module.exports = {
  command: 'leave',
  description: 'Leave the group',
  usage: `${config.prefix}leave`,
  execute: async (sock, message) => {
    const jid = message.key.remoteJid;
    if (!isGroup(jid)) return sock.sendMessage(jid, { text: 'Command only works in groups.' }, {quoted: message});
    if (!(await isAdmin(sock, jid, message.key.participant))) return sock.sendMessage(jid, { text: 'Only admins can use this command.' }, {quoted: message});
    
    await sock.groupLeave(jid);
    return sock.sendMessage(jid, { text: ' Leaving group.' }, {quoted: message});
  }
};