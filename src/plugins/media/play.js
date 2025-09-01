const axios = require("axios");
const logger = require('../../utils/logger');

module.exports = {
    command: 'play',
    aliases: ['song'],
    description: 'Download YouTube search results and download',
    usage: '!play <query>',
    category: 'Media',
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        const input = args.join(' ');
        
        if (!input) {
            return sock.sendMessage(
                sender, 
                { text: "❌ Please provide a search query. Usage: !play <song name>" }, 
                { quoted: message }
            );
        }

        await sock.sendMessage(
            sender, 
            { text: "🔍 Searching for: " + input }, 
            { quoted: message }
        );

        async function fetchVideoData(query) {
            try {
                const response = await axios.get(`https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(query)}`);
                const data = response.data;
                if (data.status) {
                    return data.result;
                } else {
                    return null;
                }
            } catch (error) {
                logger.error('Error fetching video data:', error);
                return null;
            }
        }

        const res = await fetchVideoData(input);
        if (!res) {
            await sock.sendMessage(
                sender, 
                { text: "❌ Failed to fetch video data. Please try again later." }, 
                { quoted: message }
            );
            return;
        }

        let caption = `*YouTube Play*\n\n`;
        caption += `*Title:* ${res.title}\n`;
        caption += `*Views:* ${res.views}\n`;
        caption += `*Published:* ${res.published}`;

        let cardTitle = res.title.length > 13 ? res.title.substring(0, 9) + "..." : res.title;
        
        try {
            await sock.sendMessage(
                sender,
                {
                    image: { url: `https://apis.davidcyriltech.my.id/canvas/welcomecard?background=https://h.top4top.io/p_3530kaaby1.jpg&text1=Optimus+Youtube+Play&text2=${encodeURIComponent(cardTitle)}&text3=${encodeURIComponent(res.views)}&avatar=${encodeURIComponent(res.thumbnail)}`},
                    caption: caption
                },
                { quoted: message }
            );
        } catch (imageError) {
            logger.error('Error sending image card:', imageError);
            // If image fails, send just the text
            await sock.sendMessage(
                sender, 
                { text: caption }, 
                { quoted: message }
            );
        }

        await sock.sendMessage(
            sender, 
            { text: "🎵 Downloading audio... This may take a moment." }, 
            { quoted: message }
        );

        try {
            const audioResponse = await axios.get(res.download_url, {
                responseType: 'arraybuffer',
                timeout: 60000,
                maxContentLength: 50 * 1024 * 1024,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            const audioBuffer = Buffer.from(audioResponse.data);

            if (audioBuffer.length === 0) {
                throw new Error('Downloaded audio buffer is empty');
            }

            logger.debug(`Audio buffer size: ${audioBuffer.length} bytes for ${res.title}`);

            let mimetype = 'audio/mpeg';
            let filename = `${res.title.replace(/[^\w\s]/gi, '').substring(0, 50)}.mp3`;

            if (res.download_url.includes('.m4a') || res.download_url.includes('m4a')) {
                mimetype = 'audio/mp4';
                filename = filename.replace('.mp3', '.m4a');
            } else if (res.download_url.includes('.webm')) {
                mimetype = 'audio/webm';
                filename = filename.replace('.mp3', '.webm');
            }

            await sock.sendMessage(
                sender,
                {
                    audio: audioBuffer,
                    mimetype: mimetype,
                    ptt: false,
                    fileName: filename,
                    title: res.title,
                    seconds: -1
                },
                { quoted: message }
            );

            logger.info('Audio sent successfully for query:', input);

        } catch (error) {
            logger.error('Audio download error:', error);

            let errorMessage = "❌ Failed to download audio.";
            if (error.code === 'ECONNABORTED') {
                errorMessage = "❌ Download timeout. The audio file might be too large.";
            } else if (error.response?.status === 404) {
                errorMessage = "❌ Audio file not found. The link might have expired.";
            } else if (error.response?.status === 403) {
                errorMessage = "❌ Access denied. Unable to download the audio.";
            }

            await sock.sendMessage(
                sender,
                { text: errorMessage },
                { quoted: message }
            );
        }
    }
};
