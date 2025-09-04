const config = require('../../config/config');
const axios = require('axios');

module.exports = {
    command: 'tts',
    description: 'Convert text to speech',
    usage: `${config.prefix}tts <text>`,
    execute: async (sock, message, args) => {
        if (args.length === 0) return await sock.sendMessage(message.key.remoteJid, { text: 'Provide text to convert!' }, { quoted: message });
        const text = args.join(' ');
        
        try {
            const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en-US&client=tw-ob&q=${encodeURIComponent(text)}`;
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            
            await sock.sendMessage(message.key.remoteJid, { 
                audio: Buffer.from(response.data),
                mimetype: 'audio/mp4',
                ptt: true
            }, { quoted: message });
        } catch (error) {
            await sock.sendMessage(message.key.remoteJid, { text: 'Failed to convert text to speech: ' + error.message }, { quoted: message });
        }
    }
};
