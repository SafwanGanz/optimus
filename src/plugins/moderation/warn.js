const { formatJid, isGroup, isAdmin } = require('../../utils/message');
const store = require('../../utils/store');
const config = require('../../config/config');

module.exports = {
  command: 'warn',
  description: 'Warn users in the group',
  usage: `${config.prefix}warn <phone_number>`,
  execute: async (sock, message, args) => {
    const jid = message.key.remoteJid;
    if (!isGroup(jid)) return sock.sendMessage(jid, { text: 'Command only works in groups.' }, {quoted: message});
    if (!(await isAdmin(sock, jid, message.key.participant))) return sock.sendMessage(jid, { text: 'Only admins can use this command.' }, {quoted: message});
    if (!args.length) return sock.sendMessage(jid, { text: 'Please provide a phone number.' }, {quoted: message});
    
    const user = formatJid(args[0]);
    const count = await store.getWarning(jid, user) + 1;
    await store.saveWarning(jid, user, count);
    if (count >= 3) {
      await sock.groupParticipantsUpdate(jid, [user], 'remove');
      return sock.sendMessage(jid, { text: `${user.split('@')[0]} banned after 3 warnings.` }, {quoted: message});
    }
    return sock.sendMessage(jid, { text: `Warned ${user.split('@')[0]} (${count}/3).` }, {quoted: message});
  }
};