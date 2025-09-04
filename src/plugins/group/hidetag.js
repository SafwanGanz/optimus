const config = require('../../config/config');

module.exports = {
    command: 'hidetag',
    description: 'Tag all members without showing the mention list',
    usage: `${config.prefix}hidetag [message]`,
    execute: async (sock, message, args) => {
        const groupMetadata = await sock.groupMetadata(message.key.remoteJid);
        const participants = groupMetadata.participants.map(p => p.id);
        const text = args.join(' ') || '';
        await sock.sendMessage(message.key.remoteJid, { 
            text: text,
            mentions: participants
        }, { quoted: message });
    }
};
