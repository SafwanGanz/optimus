const axios = require("axios");
const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();

module.exports = {
    command: 'play',
    aliases: ['song', 'p'],
    description: 'Search and play YouTube audio',
    usage: '!play <song name>',
    category: 'Media',
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        const input = args.join(' ');

        if (!input) {
            return sock.sendMessage(
                sender,
                { text: "❌ Please provide a song name. Usage: !play <song name>" },
                { quoted: message }
            );
        }
        let query = input;
        const data = await dy_scrap.ytsearch(query);

        let res = `*Optimus-Void | YouTube Audio Search*\n\n`;
        res += `Title: ${data.results[0].title}\n`;
        res += `Duration: ${data.results[0].duration}\n`;
        res += `Views: ${data.results[0].views}\n`;
        res += `Uploaded: ${data.results[0].ago}\n`;
        res += `Channel: ${data.results[0].author.name}\n`;
        res += `Link: https://www.youtube.com/watch?v=${data.results[0].videoId}\n\n`;
        res += `Downloading audio, please wait... 🎧`;
        sock.sendMessage(
            sender,
            { image: { url: data.results[0].thumbnail }, caption: res },
            { quoted: message }
        );
        try {
            const res = await dy_scrap.ytmp3(`https://www.youtube.com/watch?v=${data.results[0].videoId}`);
            const audioUrl = res
            sock.sendMessage(
                sender,
                { audio: { url: res.result.download.url }, mimetype: 'audio/mpeg', ptt: false },
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
};
