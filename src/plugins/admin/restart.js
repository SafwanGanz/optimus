const config = require('../../config/config');

module.exports = {
    command: 'restart',
    description: 'Restart the bot',
    usage: `${config.prefix}restart`,
    execute: async (sock, message, args) => {
        const isAdmin = message.key.fromMe || (message.key.participant || message.key.remoteJid === sock?.user?.id);
        if (!isAdmin) {
            return sock.sendMessage(message.key.remoteJid, { text: 'Only admins can use this command!' }, { quoted: message });
        }

        try {
            await sock.sendMessage(message.key.remoteJid, { text: '🔄 Restarting the bot...' }, { quoted: message });
            global.isRestarting = true;
            process.exit(0);
        } catch (error) {
            await sock.sendMessage(message.key.remoteJid, { text: 'Failed to restart: ' + error.message }, { quoted: message });
        }
    }
};
