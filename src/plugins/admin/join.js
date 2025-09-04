const config = require('../../config/config');

module.exports = {
    command: 'join',
    description: 'Join a group via invite link',
    usage: `${config.prefix}join <invite_link>`,
    execute: async (sock, message, args) => {
        if (!message.key.fromMe) return;
        if (args.length === 0) return await sock.sendMessage(message.key.remoteJid, { text: 'Provide a group invite link!' }, { quoted: message });
        const inviteLink = args[0].replace('https://chat.whatsapp.com/', '');
        try {
            const response = await sock.groupAcceptInvite(inviteLink);
            await sock.sendMessage(message.key.remoteJid, { text: 'Joined the group successfully!' }, { quoted: message });
        } catch (error) {
            await sock.sendMessage(message.key.remoteJid, { text: 'Failed to join group: ' + error.message }, { quoted: message });
        }
    }
};
