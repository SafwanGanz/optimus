const { formatJid, isGroup, isAdmin } = require('../../utils/message');
const config = require('../../config/config');

module.exports = {
  command: 'ban',
  description: 'Ban users from the group',
  usage: `${config.prefix}ban <phone_number>`,
  execute: async (sock, message, args) => {
    const jid = message.key.remoteJid;
    if (!isGroup(jid)) return sock.sendMessage(jid, { text: 'Command only works in groups.' }, {quoted: message});
    if (!(await isAdmin(sock, jid, message.key.participant))) return sock.sendMessage(jid, { text: 'Only admins can use this command.' }, {quoted: message});
    if (!args.length) return sock.sendMessage(jid, { text: 'Please provide a phone number.' }, {quoted: message});
    
    const numbers = args.map(formatJid);
    await sock.groupParticipantsUpdate(jid, numbers, 'remove');
    return sock.sendMessage(jid, { text: `Banned ${numbers.length} user(s) from the group.` }, {quoted: message});
  }
};