const { isGroup, isAdmin } = require('../../utils/message');
const config = require('../../config/config');

module.exports = {
  command: 'mute',
  description: 'Mute or unmute the group',
  usage: `${config.prefix}mute <on|off>`,
  execute: async (sock, message, args) => {
    const jid = message.key.remoteJid;
    if (!isGroup(jid)) return sock.sendMessage(jid, { text: 'Command only works in groups.' }, {quoted: message});
    if (!(await isAdmin(sock, jid, message.key.participant))) return sock.sendMessage(jid, { text: 'Only admins can use this command.' }, {quoted: message});
    if (!args.length) return sock.sendMessage(jid, { text: 'Usage: !mute <on|off>' }), {quoted: message};
    
    const value = args[0].toLowerCase() === 'on' ? 8 * 60 * 60 * 1000 : null;
    await sock.chatModify({ mute: value }, jid);
    return sock.sendMessage(jid, { text: `Group mute ${args[0].toLowerCase()}.` }, {quoted: message});
  }
};
