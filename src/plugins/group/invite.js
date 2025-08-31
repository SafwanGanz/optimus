const { isGroup, isAdmin } = require('../../utils/message');
const config = require('../../config/config');

module.exports = {
  command: 'invite',
  description: 'Generate group invite link',
  usage: `${config.prefix}invite`,
  execute: async (sock, message) => {
    const jid = message.key.remoteJid;
    if (!isGroup(jid)) return sock.sendMessage(jid, { text: 'Command only works in groups.' }, {quoted: message});
    if (!(await isAdmin(sock, jid, message.key.participant))) return sock.sendMessage(jid, { text: 'Only admins can use this command.' }, {quoted: message});
    
    const code = await sock.groupInviteCode(jid);
    return sock.sendMessage(jid, { text: `Invite link: https://chat.whatsapp.com/${code}` }, {quoted: message});
  }
};