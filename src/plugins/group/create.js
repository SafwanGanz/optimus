const { formatJid, isAdmin } = require('../../utils/message');
const config = require('../../config/config');

module.exports = {
  command: 'create',
  description: 'Create a new group',
  usage: `${config.prefix}create <name> <phone_number>`,
  execute: async (sock, message, args) => {
    if (args.length < 2) return sock.sendMessage(message.key.remoteJid, { text: 'Usage: !create <name> <phone_number>' }, {quoted: message});
    
    const name = args[0];
    const numbers = args.slice(1).map(formatJid);
    const group = await sock.groupCreate(name, numbers);
    return sock.sendMessage(group.id, { text: `Group ${name} created.` }, {quoted: message});
  }
};