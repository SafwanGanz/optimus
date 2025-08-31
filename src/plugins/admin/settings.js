const { isGroup, isAdmin } = require('../../utils/message');
const config = require('../../config/config');

module.exports = {
  command: 'settings',
  description: 'Update group settings (announcement/locked)',
  usage: `${config.prefix}settings <announcement|locked> <on|off>`,
  execute: async (sock, message, args) => {
    const jid = message.key.remoteJid;
    if (!isGroup(jid)) return sock.sendMessage(jid, { text: 'Command only works in groups.' }, {quoted: message});
    if (!(await isAdmin(sock, jid, message.key.participant))) return sock.sendMessage(jid, { text: 'Only admins can use this command.' }, {quoted: message});
    if (args.length < 2) return sock.sendMessage(jid, { text: 'Usage: !settings <announcement|locked> <on|off>' }, {quoted: message});
    
    const setting = args[0].toLowerCase();
    const value = args[1].toLowerCase() === 'on' ? setting : `not_${setting}`;
    await sock.groupSettingUpdate(jid, value);
    return sock.sendMessage(jid, { text: `Group ${setting} set to ${args[1].toLowerCase()}.` }, {quoted: message});
  }
};