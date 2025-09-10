const config = require('../../config/config');
const { createWriteStream } = require('fs');
const { downloadMediaMessage, getContentType } = require('@whiskeysockets/baileys');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegStatic);

module.exports = {
    command: 'audiotovideo',
    description: 'Convert audio to video',
    usage: `${config.prefix}audiotovideo`,
    execute: async (sock, message, args) => {
        try {
            const quoted = message.message.extendedTextMessage?.contextInfo?.quotedMessage;
            if (!quoted) {
                return await sock.sendMessage(message.key.remoteJid, { text: 'Reply to an audio message!' }, { quoted: message });
            }
  
            const messageType = getContentType(quoted);
            if (messageType !== 'audioMessage') {
                return await sock.sendMessage(message.key.remoteJid, { text: 'Reply to an audio message!' }, { quoted: message });
            }

            const downloadsDir = path.join(process.cwd(), 'downloads');
            if (!fs.existsSync(downloadsDir)) {
                fs.mkdirSync(downloadsDir, { recursive: true });
            }

            const audioPath = path.join(downloadsDir, `${message.key.id}.mp3`);
            const imagePath = path.join(downloadsDir, `${message.key.id}.jpg`);
            const videoPath = path.join(downloadsDir, `${message.key.id}.mp4`);

            const defaultImage = 'https://i.ibb.co/HpKQ6KTc/pic.jpg';
            const response = await axios.get(defaultImage, { responseType: 'arraybuffer' });
            fs.writeFileSync(imagePath, Buffer.from(response.data));

            const writeStream = createWriteStream(audioPath);

            const stream = await downloadMediaMessage(
                { message: quoted },
                'stream',
                {},
                {
                    logger: console,
                    reuploadRequest: sock.updateMediaMessage
                }
            );

            await new Promise((resolve, reject) => {
                stream.pipe(writeStream);
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });

            await new Promise((resolve, reject) => {
                ffmpeg()
                    .input(imagePath)
                    .inputOptions(['-loop 1'])
                    .input(audioPath)
                    .outputOptions(['-c:v libx264', '-c:a aac', '-shortest', '-pix_fmt yuv420p'])
                    .output(videoPath)
                    .on('end', resolve)
                    .on('error', reject)
                    .run();
            });

            await sock.sendMessage(message.key.remoteJid, { 
                video: { url: videoPath },
                mimetype: 'video/mp4',
                caption: 'Converted audio to video'
            }, { quoted: message });

            fs.unlinkSync(audioPath);
            fs.unlinkSync(imagePath);
            fs.unlinkSync(videoPath);
        } catch (error) {
            console.error('Error in audiovideo command:', error);
            await sock.sendMessage(message.key.remoteJid, { 
                text: 'Failed to convert audio to video: ' + error.message 
            }, { quoted: message });
        }
    }
};
