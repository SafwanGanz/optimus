const config = require('../../config/config');
const { createWriteStream } = require('fs');
const { downloadMediaMessage, getContentType } = require('@whiskeysockets/baileys');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const sharp = require('sharp');
const NodeID3 = require('node-id3');

module.exports = {
    command: 'take',
    description: 'Save audio from a message',
    usage: `${config.prefix}take [title]`,
    execute: async (sock, message, args) => {
        try {
              const input = args.join(' ').split(',').map(arg => arg.trim());
            const [title = '', artist = '', thumburl = ''] = input;

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
            const defaultImage = thumburl || 'https://i.ibb.co/HpKQ6KTc/pic.jpg';
            const response = await axios.get(defaultImage, { responseType: 'arraybuffer' });
            const thumbnailBuffer = await sharp(Buffer.from(response.data))
                .resize(100, 100)
                .jpeg()
                .toBuffer();

            const filePath = path.join(downloadsDir, `${message.key.id}.mp3`);
            const writeStream = createWriteStream(filePath);

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

            const fileName = `${title}.mp3`;
            
            const tags = {
                title: title,
                artist: artist,
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

            await sock.sendMessage(message.key.remoteJid, { 
                document: { url: filePath },
                mimetype: 'audio/mpeg',
                fileName: fileName,
                title: title,
                jpegThumbnail: thumbnailBuffer
            }, { quoted: message });

            fs.unlinkSync(filePath);
        } catch (error) {
            console.error('Error in take command:', error);
            await sock.sendMessage(message.key.remoteJid, { 
                text: 'Failed to process audio: ' + error.message 
            }, { quoted: message });
        }
    }
};
