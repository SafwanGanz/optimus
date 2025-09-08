const { isGroup, isAdmin } = require('../../utils/message');
const config = require('../../config/config');
const { getWelcomeEnabled, setWelcomeEnabled } = require('../../utils/database');

module.exports = {
  command: 'settings',
  description: 'Update group settings (announcement/locked/welcome)',
  usage: `${config.prefix}settings <announcement|locked|welcome> <on|off>`,
  execute: async (sock, message, args) => {
    const jid = message.key.remoteJid;
    if (!isGroup(jid)) return sock.sendMessage(jid, { text: 'Command only works in groups.' }, {quoted: message});
    if (!(await isAdmin(sock, jid, message.key.participant))) return sock.sendMessage(jid, { text: 'Only admins can use this command.' }, {quoted: message});
    if (args.length < 2) return sock.sendMessage(jid, { text: 'Usage: !settings <announcement|locked|welcome> <on|off>' }, {quoted: message});
    
    const setting = args[0].toLowerCase();
    const value = args[1].toLowerCase();
    
    if (setting === 'welcome') {
      const enabled = value === 'on' ? 1 : 0;
      await setWelcomeEnabled(jid, enabled);
      return sock.sendMessage(jid, { text: `Welcome messages ${value} for this group.` }, {quoted: message});
    }
    
    const waSetting = value === 'on' ? setting : `not_${setting}`;
    await sock.groupSettingUpdate(jid, waSetting);
    return sock.sendMessage(jid, { text: `Group ${setting} set to ${value}.` }, {quoted: message});
  }
};
