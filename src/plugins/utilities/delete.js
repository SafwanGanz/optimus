const config = require('../../config/config');

module.exports = {
    command: 'delete',
    description: 'Delete bot message',
    usage: `${config.prefix}delete [reply]`,
    execute: async (sock, message, args) => {
        const quoted = message.message.extendedTextMessage?.contextInfo;
        if (!quoted) return await sock.sendMessage(message.key.remoteJid, { text: 'Reply to a message to delete!' }, { quoted: message });
        if (!quoted.participant) return await sock.sendMessage(message.key.remoteJid, { text: 'Can only delete bot messages!' }, { quoted: message });
        
        const key = {
            remoteJid: message.key.remoteJid,
            fromMe: true,
            id: quoted.stanzaId,
            participant: quoted.participant
        };
        
        await sock.sendMessage(message.key.remoteJid, { delete: key });
    }
};
