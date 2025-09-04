const config = require('../../config/config');
const os = require('os');

module.exports = {
    command: 'speed',
    description: 'Test bot speed',
    usage: `${config.prefix}speed`,
    execute: async (sock, message, args) => {
        const start = Date.now();
        const ping = Date.now() - start;
        const uptime = process.uptime() * 1000;
        const memory = process.memoryUsage();
        
        const response = `🤖 *Bot Speed Test*\n\n` +
            `Ping: ${ping}ms\n` +
            `Uptime: ${Math.floor(uptime / (24 * 60 * 60 * 1000))}d ${Math.floor((uptime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))}h ${Math.floor((uptime % (60 * 60 * 1000)) / (60 * 1000))}m\n` +
            `RAM Usage: ${Math.floor(memory.heapUsed / 1024 / 1024)}MB / ${Math.floor(os.totalmem() / 1024 / 1024)}MB`;
            
        await sock.sendMessage(message.key.remoteJid, { text: response }, { quoted: message });
    }
};
