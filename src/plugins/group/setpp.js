const config = require('../../config/config');

module.exports = {
    command: 'setpp',
    description: 'Set group profile picture',
    usage: `${config.prefix}setpp [caption]`,
    execute: async (sock, message, args) => {
        if (!message.key.remoteJid.endsWith('@g.us')) return;
        const quoted = message.message.imageMessage || message.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
        if (!quoted) return await sock.sendMessage(message.key.remoteJid, { text: 'Reply to an image!' }, { quoted: message });
        
        try {
            const media = await sock.downloadMediaMessage(quoted);
            await sock.updateProfilePicture(message.key.remoteJid, media);
            await sock.sendMessage(message.key.remoteJid, { text: 'Group profile picture updated successfully!' }, { quoted: message });
        } catch (error) {
            await sock.sendMessage(message.key.remoteJid, { text: 'Failed to update profile picture: ' + error.message }, { quoted: message });
        }
    }
};
