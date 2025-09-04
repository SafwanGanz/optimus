const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();

module.exports = {
    command: 'insta',
    aliases: ['ig', 'instagram'],
    description: 'Download Instagram media',
    usage: '!insta <Instagram post URL>',
    category: 'Media',
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        const input = args.join(' ');

        if (!input) {
            return sock.sendMessage(
                sender,
                { text: "❌ Please provide an Instagram post URL. Usage: !insta <Instagram post URL>" },
                { quoted: message }
            );
        }
        let link = input;
        const data = await dy_scrap.instagram(link);
        if (data.result.video) {
            sock.sendMessage(
                sender,
                { video: { url: data.result.video }, caption: 'Here is your Instagram video!' },
                { quoted: message }
            );
        } else if (data.result.image) {
            sock.sendMessage(
                sender,
                { image: { url: data.result.image }, caption: 'Here is your Instagram image!' },
                { quoted: message }
            );
        }
    }
}
