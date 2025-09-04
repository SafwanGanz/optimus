const axios = require("axios");
const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();

module.exports = {
    command: 'mp3',
    aliases: ['ytaudio', 'ytmp3'],
    description: 'Download YouTube audio',
    usage: '!mp3 <YouTube video URL>',
    category: 'Media',
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        const input = args.join(' ');
        if (!input) {
            return sock.sendMessage(
                sender,
                { text: "❌ Please provide a YouTube video URL. Usage: !mp3 <YouTube video URL>" },
                { quoted: message }
            );
        }
        let link = input;
        const data = await dy_scrap.ytmp3(link);
        try {
            const audioUrl = data.result.download.url;
            sock.sendMessage(
                sender,
                { audio: { url: audioUrl }, mimetype: 'audio/mpeg', ptt: false },
                { quoted: message }
            );
        } catch (error) {
            return sock.sendMessage(
                sender,
                { text: "❌ Failed to download audio. Please try again later." },
                { quoted: message }
            );
        }
    }
}
