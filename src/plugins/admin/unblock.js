const config = require('../../config/config');

module.exports = {
    command: 'unblock',
    description: 'Unblock a user',
    usage: `${config.prefix}unblock <@mention>`,
    execute: async (sock, message, args) => {
        if (!message.key.fromMe) return;
        const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (mentions.length === 0) return await sock.sendMessage(message.key.remoteJid, { text: 'Tag a user to unblock!' }, { quoted: message });
        await sock.updateBlockStatus(mentions[0], "unblock");
        await sock.sendMessage(message.key.remoteJid, { text: 'User unblocked successfully!' }, { quoted: message });
    }
};
