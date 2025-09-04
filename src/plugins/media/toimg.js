const config = require('../../config/config');

module.exports = {
    command: 'toimg',
    description: 'Convert sticker to image',
    usage: `${config.prefix}toimg [reply]`,
    execute: async (sock, message, args) => {
        const quoted = message.message.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted?.stickerMessage) return await sock.sendMessage(message.key.remoteJid, { text: 'Reply to a sticker!' }, { quoted: message });
        
        try {
            const media = await sock.downloadMediaMessage({ message: quoted });
            await sock.sendMessage(message.key.remoteJid, { image: media }, { quoted: message });
        } catch (error) {
            await sock.sendMessage(message.key.remoteJid, { text: 'Failed to convert sticker: ' + error.message }, { quoted: message });
        }
    }
};
