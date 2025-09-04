const config = require('../../config/config');

module.exports = {
    command: 'runtime',
    description: 'Show bot uptime',
    usage: `${config.prefix}runtime`,
    execute: async (sock, message, args) => {
        const uptime = process.uptime() * 1000;
        const days = Math.floor(uptime / (24 * 60 * 60 * 1000));
        const hours = Math.floor((uptime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((uptime % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((uptime % (60 * 1000)) / 1000);
        
        const response = `🤖 *Bot Runtime*\n\n${days}d ${hours}h ${minutes}m ${seconds}s`;
        await sock.sendMessage(message.key.remoteJid, { text: response }, { quoted: message });
    }
};
