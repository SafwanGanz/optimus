const config = require('../../config/config');

module.exports = {
    command: 'block',
    description: 'Block a user',
    usage: `${config.prefix}block <@mention>`,
    execute: async (sock, message, args) => {
        if (!message.key.fromMe) return;
        const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (mentions.length === 0) return await sock.sendMessage(message.key.remoteJid, { text: 'Tag a user to block!' }, { quoted: message });
        await sock.updateBlockStatus(mentions[0], "block");
        await sock.sendMessage(message.key.remoteJid, { text: 'User blocked successfully!' }, { quoted: message });
    }
};
