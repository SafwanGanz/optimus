const config = require('../../config/config');

module.exports = {
    command: 'left',
    description: 'Leave the current group',
    usage: `${config.prefix}left`,
    execute: async (sock, message, args) => {
        if (!message.key.remoteJid.endsWith('@g.us')) return;
        await sock.groupLeave(message.key.remoteJid);
    }
};
