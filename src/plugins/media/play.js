const axios = require("axios");
const DY_SCRAP = require('@dark-yasiya/scrap');
const NodeID3 = require('node-id3');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { createWriteStream } = require('fs');
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

        sock.sendMessage(
            sender,
            { text: 'Please wait while we process your request...' },
            { quoted: message }
        );
        try {
            const res = await dy_scrap.ytmp3_v2(`https://www.youtube.com/watch?v=${data.results[0].videoId}`);

            const downloadsDir = path.join(process.cwd(), 'downloads');
            if (!fs.existsSync(downloadsDir)) {
                fs.mkdirSync(downloadsDir, { recursive: true });
            }

            const defaultImage = data.results[0].thumbnail || 'https://i.ibb.co/HpKQ6KTc/pic.jpg';
            const response = await axios.get(defaultImage, { responseType: 'arraybuffer' });
            const thumbnailBuffer = await sharp(Buffer.from(response.data))
                .resize(100, 100)
                .jpeg()
                .toBuffer();

            const audioResponse = await axios.get(res.result.download.url, { responseType: 'arraybuffer' });
            const filePath = path.join(downloadsDir, `${message.key.id}.mp3`);
            fs.writeFileSync(filePath, Buffer.from(audioResponse.data));

            const tags = {
                title: data.results[0].title,
                artist: "optimus Void",
                image: {
                    mime: "image/jpeg",
                    type: {
                        id: 3,
                        name: "front cover"
                    },
                    description: "Cover",
                    imageBuffer: thumbnailBuffer
                }
            };

            NodeID3.write(tags, filePath);

            const fileName = `${data.results[0].title}.mp3`;
            let res_ = `*Optimus-Void | YouTube Audio Search*\n\n`;
            res_ += `Title: ${data.results[0].title}\n`;
            res_ += `Duration: ${data.results[0].duration}\n`;
            res_ += `Views: ${data.results[0].views}\n`;
            res_ += `Uploaded: ${data.results[0].ago}\n`;
            res_ += `Channel: ${data.results[0].author.name}\n`;
            res_ += `Link: https://www.youtube.com/watch?v=${data.results[0].videoId}\n\n`;
            res_ += `Use Headphones for better experience 🎧`;
            await sock.sendMessage(
                sender,
                {
                    document: {
                        url: filePath
                    },
                    mimetype: 'audio/mpeg',
                    fileName: fileName,
                    caption: res_,
                    title: data.results[0].title,
                    jpegThumbnail: thumbnailBuffer,
                    ptt: false
                },
                { quoted: message }
            );

            fs.unlinkSync(filePath);
        } catch (error) {
            console.error('Error in play command:', error);
            return sock.sendMessage(
                sender,
                { text: "❌ Failed to download audio. Please try again later." },
                { quoted: message }
            );
        }
    }
}
