const config = require('../../config/config');
const { exec } = require('child_process');

module.exports = {
    command: 'shell',
    description: 'Execute shell command',
    usage: `${config.prefix}shell <command>`,
    execute: async (sock, message, args) => {
        if (!message.key.fromMe) return;
        const cmd = args.join(' ');
        if (!cmd) return await sock.sendMessage(message.key.remoteJid, { text: 'No command provided!' }, { quoted: message });
        exec(cmd, async (error, stdout, stderr) => {
            if (error) {
                await sock.sendMessage(message.key.remoteJid, { text: error.message }, { quoted: message });
                return;
            }
            if (stderr) {
                await sock.sendMessage(message.key.remoteJid, { text: stderr }, { quoted: message });
                return;
            }
            await sock.sendMessage(message.key.remoteJid, { text: stdout }, { quoted: message });
        });
    }
};
