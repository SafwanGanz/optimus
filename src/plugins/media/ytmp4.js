const axios = require("axios");
const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();

module.exports = {
    command: 'mp4',
    aliases: ['ytvideo', 'ytmp4'],
    description: 'Download YouTube video',
    usage: '!mp4 <YouTube video URL>',
    category: 'Media',
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        const input = args.join(' ');
        if (!input) {
            return sock.sendMessage(
                sender,
                { text: "❌ Please provide a YouTube video URL. Usage: !mp4 <YouTube video URL>" },
                { quoted: message }
            );
        }
        let link = input;
        const data = await dy_scrap.ytmp4(link, '720');
        try {
            const videoUrl = data.result.download.url;
            sock.sendMessage(
                sender,
                { video: { url: videoUrl }, mimetype: 'video/mp4', caption: `Here is your video: ${data.result.title}` },
                { quoted: message }
            );
        } catch (error) {
            return sock.sendMessage(
                sender,
                { text: "❌ Failed to download video. Please try again later." },
                { quoted: message }
            );
        }
    }
}
