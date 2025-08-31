const { formatJid, isGroup, isAdmin } = require('../../utils/message');
const config = require('../../config/config');

module.exports = {
  command: 'demote',
  description: 'Demote users from admin',
  usage: `${config.prefix}demote <phone_number>`,
  execute: async (sock, message, args) => {
    const jid = message.key.remoteJid;
    if (!isGroup(jid)) return sock.sendMessage(jid, { text: 'Command only works in groups.' }, {quoted: message});
    if (!(await isAdmin(sock, jid, message.key.participant))) return sock.sendMessage(jid, { text: 'Only admins can use this command.' }, {quoted: message});
    if (!args.length) return sock.sendMessage(jid, { text: 'Please provide a phone number.' }, {quoted: message});
    
    const numbers = args.map(formatJid);
    const response = await sock.groupParticipantsUpdate(jid, numbers, 'demote');
    return sock.sendMessage(jid, { text: `Demoted ${numbers.length} user(s) from admin.` }, {quoted: message});
  }
};